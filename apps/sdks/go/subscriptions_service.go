// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"encoding/json"
	"strings"
)

type SubscriptionsService struct {
	client *Client
}

func (s *SubscriptionsService) Cancel(id string, body interface{}) (interface{}, error) {
		path := "/subscriptions/{id}/cancel"
		path = strings.ReplaceAll(path, "{id}", id)
		bodyResp, err := s.client.doRequest("POST", path, nil, body)
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


func (s *SubscriptionsService) ChangePlan(id string, body interface{}) (interface{}, error) {
		path := "/subscriptions/{id}/change-plan"
		path = strings.ReplaceAll(path, "{id}", id)
		bodyResp, err := s.client.doRequest("POST", path, nil, body)
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


func (s *SubscriptionsService) Get(id string) (interface{}, error) {
		path := "/subscriptions/{id}"
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


func (s *SubscriptionsService) GetUsage(id string) (interface{}, error) {
		path := "/subscriptions/{id}/usage"
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


func (s *SubscriptionsService) List(params map[string]string) (interface{}, error) {
		path := "/subscriptions"
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


func (s *SubscriptionsService) Resume(id string) (interface{}, error) {
		path := "/subscriptions/{id}/resume"
		path = strings.ReplaceAll(path, "{id}", id)
		bodyResp, err := s.client.doRequest("POST", path, nil, nil)
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


func (s *SubscriptionsService) Update(id string, body interface{}) (interface{}, error) {
		path := "/subscriptions/{id}"
		path = strings.ReplaceAll(path, "{id}", id)
		bodyResp, err := s.client.doRequest("PATCH", path, nil, body)
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

