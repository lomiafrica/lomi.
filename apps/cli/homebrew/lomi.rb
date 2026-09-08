# Documentation: https://docs.lomi.africa/build/cli

class Lomi < Formula
  desc "CLI for lomi.'s payment infrastructure"
  homepage "https://lomi.africa"
  version "3.1.1"
  license "MIT"

  on_macos do
    on_intel do
      url "https://github.com/lomiafrica/lomi./releases/download/cli-v3.1.1/lomi-x86_64-apple-darwin"
      sha256 "REPLACE_ON_RELEASE"
    end
    on_arm do
      url "https://github.com/lomiafrica/lomi./releases/download/cli-v3.1.1/lomi-aarch64-apple-darwin"
      sha256 "436781f61c340c99cb009ec725be289e32bcbfc308260ed14b22f646bf7eb8cd"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/lomiafrica/lomi./releases/download/cli-v3.1.1/lomi-x86_64-unknown-linux-gnu"
      sha256 "REPLACE_ON_RELEASE"
    end
  end

  def install
    bin.install "lomi-aarch64-apple-darwin" => "lomi" if Hardware::CPU.arm?
    bin.install "lomi-x86_64-apple-darwin" => "lomi" if Hardware::CPU.intel? && OS.mac?
    bin.install "lomi-x86_64-unknown-linux-gnu" => "lomi" if OS.linux?
  end

  test do
    assert_match "lomi", shell_output("#{bin}/lomi --version")
  end
end
