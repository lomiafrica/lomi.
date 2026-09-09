// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
	"strings"
)

type TransactionsService struct {
	client *Client
}

func (s *TransactionsService) Get(id string) (interface{}, error) {
		path := "/transactions/{id}"
		path = strings.ReplaceAll(path, "{id}", id)
		bodyResp, err := s.client.doRequest("GET", path, nil, nil)
		if err != nil {
			return nil, err
		}
		if len(bodyResp) == 0 {
			return nil, nil
		}
		var out interface{}
		if err := json.Unmarshal(bodyResp, &out); err != nil {
			return nil, err
		}
		return out, nil
	}


func (s *TransactionsService) List(params map[string]string) (interface{}, error) {
		path := "/transactions"
		bodyResp, err := s.client.doRequest("GET", path, paramsToQuery(params), nil)
		if err != nil {
			return nil, err
		}
		if len(bodyResp) == 0 {
			return nil, nil
		}
		var out interface{}
		if err := json.Unmarshal(bodyResp, &out); err != nil {
			return nil, err
		}
		return out, nil
	}


func (s *TransactionsService) ReceiptPdf(id string) (interface{}, error) {
		path := "/transactions/{id}/receipt.pdf"
		path = strings.ReplaceAll(path, "{id}", id)
		bodyResp, err := s.client.doRequest("GET", path, nil, nil)
		if err != nil {
			return nil, err
		}
		if len(bodyResp) == 0 {
			return nil, nil
		}
		var out interface{}
		if err := json.Unmarshal(bodyResp, &out); err != nil {
			return nil, err
		}
		return out, nil
	}

