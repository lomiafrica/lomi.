use anyhow::{bail, Result};
use std::fs;
use std::path::{Path, PathBuf};

use super::manifest::RuleOption;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InstallTarget {
    Cursor,
    ClaudeCode,
    Codex,
    Vscode,
    LlmsTxt,
}

impl InstallTarget {
    pub fn all() -> &'static [Self] {
        &[
            Self::Cursor,
            Self::ClaudeCode,
            Self::Codex,
            Self::Vscode,
            Self::LlmsTxt,
        ]
    }

    pub fn from_str(value: &str) -> Result<Self> {
        match value.to_lowercase().as_str() {
            "cursor" => Ok(Self::Cursor),
            "claude-code" | "claude" => Ok(Self::ClaudeCode),
            "codex" | "agents.md" | "agents-md" | "agents" => Ok(Self::Codex),
            "vscode" => Ok(Self::Vscode),
            "llms.txt" | "llms-txt" | "llms" => Ok(Self::LlmsTxt),
            other => bail!("Unsupported install target: {other}"),
        }
    }

    pub fn label(&self) -> &'static str {
        match self {
            Self::Cursor => "Cursor",
            Self::ClaudeCode => "Claude Code",
            Self::Codex => "OpenAI Codex",
            Self::Vscode => "VS Code",
            Self::LlmsTxt => "llms.txt (project root)",
        }
    }

    pub fn hint(&self) -> &'static str {
        match self {
            Self::Cursor => "Installs .cursor/rules/lomi.*.mdc rule files",
            Self::ClaudeCode => "Appends sections to CLAUDE.md",
            Self::Codex => "Appends sections to AGENTS.md for Codex / Jules / OpenCode",
            Self::Vscode => "Installs .github/instructions/lomi-*.instructions.md",
            Self::LlmsTxt => "Writes llms.txt briefing from docs.lomi.africa",
        }
    }
}

pub fn install_rules(targets: &[InstallTarget], options: &[RuleOption]) -> Result<Vec<PathBuf>> {
    let mut installed = Vec::new();

    for target in targets {
        if *target == InstallTarget::LlmsTxt {
            installed.push(install_llms_txt(options)?);
            continue;
        }

        for option in options {
            if option.name == "llms-txt" {
                continue;
            }
            let path = install_for_target(*target, option)?;
            installed.push(path);
        }
    }

    Ok(installed)
}

fn install_llms_txt(options: &[RuleOption]) -> Result<PathBuf> {
    let llms = options
        .iter()
        .find(|option| option.name == "llms-txt")
        .map(|option| option.contents.as_str())
        .unwrap_or(include_str!("../utils/rules/llms.txt"));

    write_file(Path::new("llms.txt"), llms)
}

fn install_for_target(target: InstallTarget, option: &RuleOption) -> Result<PathBuf> {
    match target {
        InstallTarget::Cursor => {
            let path = PathBuf::from(".cursor/rules").join(format!("lomi.{}.mdc", option.name));
            let contents = format!(
                "---\ndescription: {}\nglobs: {}\nalwaysApply: false\n---\n\n{}",
                option.label, option.apply_to, option.contents
            );
            write_file(&path, &contents)
        }
        InstallTarget::ClaudeCode => {
            let path = PathBuf::from("CLAUDE.md");
            let section = format!(
                "<!-- LOMI. {} ({}) START -->\n{}\n<!-- LOMI. {} ({}) END -->",
                option.title, option.name, option.contents, option.title, option.name
            );
            merge_replace_section(&path, &option.name, &section)
        }
        InstallTarget::Codex => {
            let path = PathBuf::from("AGENTS.md");
            let section = format!(
                "<!-- LOMI. {} ({}) START -->\n{}\n<!-- LOMI. {} ({}) END -->",
                option.title, option.name, option.contents, option.title, option.name
            );
            merge_replace_section(&path, &option.name, &section)
        }
        InstallTarget::Vscode => {
            let path = PathBuf::from(".github/instructions")
                .join(format!("lomi-{}.instructions.md", option.name));
            let contents = format!(
                "---\ntitle: {}\napplyTo: {}\n---\n\n{}",
                option.title, option.apply_to, option.contents
            );
            write_file(&path, &contents)
        }
        InstallTarget::LlmsTxt => unreachable!("handled separately"),
    }
}

fn write_file(path: &Path, contents: &str) -> Result<PathBuf> {
    if let Some(parent) = path.parent() {
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent)?;
        }
    }
    fs::write(path, contents)?;
    Ok(path.to_path_buf())
}

fn merge_replace_section(path: &Path, section_name: &str, section: &str) -> Result<PathBuf> {
    let marker_start = format!("<!-- LOMI. {section_name} START -->");
    let marker_end = format!("<!-- LOMI. {section_name} END -->");

    if path.exists() {
        let existing = fs::read_to_string(path)?;
        if existing.contains(&marker_start) {
            let pattern_start = existing.find(&marker_start).ok_or_else(|| {
                anyhow::anyhow!("Missing LOMI rules start marker in {}", path.display())
            })?;
            let pattern_end = existing.find(&marker_end).ok_or_else(|| {
                anyhow::anyhow!("Missing LOMI rules end marker in {}", path.display())
            })? + marker_end.len();
            let mut updated = String::new();
            updated.push_str(&existing[..pattern_start]);
            updated.push_str(section);
            updated.push_str(&existing[pattern_end..]);
            fs::write(path, updated.trim_start().to_string() + "\n")?;
            return Ok(path.to_path_buf());
        }

        let mut updated = existing;
        if !updated.ends_with('\n') {
            updated.push('\n');
        }
        updated.push('\n');
        updated.push_str(section);
        updated.push('\n');
        fs::write(path, updated)?;
    } else {
        fs::write(path, format!("{section}\n"))?;
    }

    Ok(path.to_path_buf())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;
    use std::path::Path;

    #[test]
    fn install_target_parsing() {
        assert!(InstallTarget::from_str("cursor").is_ok());
        assert!(InstallTarget::from_str("claude-code").is_ok());
        assert!(InstallTarget::from_str("codex").is_ok());
        assert!(InstallTarget::from_str("llms.txt").is_ok());
        assert!(InstallTarget::from_str("unknown").is_err());
    }

    fn with_temp_cwd<T>(f: impl FnOnce(&Path) -> T) -> T {
        let cwd = env::current_dir().expect("current dir");
        let project = tempfile::tempdir().expect("tempdir");
        env::set_current_dir(project.path()).expect("chdir tempdir");
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| f(project.path())));
        let _ = env::set_current_dir(&cwd);
        match result {
            Ok(value) => value,
            Err(panic) => std::panic::resume_unwind(panic),
        }
    }

    #[test]
    fn install_cursor_rules() {
        let rules = crate::rules::manifest::load_current_rules().unwrap();
        with_temp_cwd(|root| {
            let installed = install_rules(&[InstallTarget::Cursor], &rules).unwrap();
            assert!(!installed.is_empty());
            assert!(root.join(".cursor/rules/lomi.sdk-basics.mdc").exists());
        });
    }

    #[test]
    fn install_llms_txt() {
        let rules = crate::rules::manifest::load_current_rules().unwrap();
        with_temp_cwd(|root| {
            let installed = install_rules(&[InstallTarget::LlmsTxt], &rules).unwrap();
            assert_eq!(installed.len(), 1);
            let content = fs::read_to_string(root.join("llms.txt")).unwrap();
            assert!(content.contains("lomi."));
        });
    }
}
