export interface EventFilterCondition {
  attribute: string;
  operator:
    | 'equal'
    | 'less_than'
    | 'greater_than'
    | 'between'
    | 'equals'
    | 'does_not_equals'
    | 'contains'
    | 'does_not_contain';
  value: string;
  value2?: string;
}

export interface EventFilterStep {
  order: number;
  name: string;
  eventType?: string;
  conditions?: EventFilterCondition[];
}

export interface UserEventProperties {
  property: string;
  type: 'string' | 'number';
}

export interface UserEvent {
  type:
    | 'session_start'
    | 'session_end'
    | 'purchase'
    | 'page_visit'
    | 'cart_update'
    | 'view_item';
  properties: UserEventProperties[];
}
