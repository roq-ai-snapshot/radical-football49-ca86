import { TeamInterface } from 'interfaces/team';

export interface EventInterface {
  id?: string;
  name: string;
  start_time: Date;
  end_time: Date;
  team_id: string;

  team?: TeamInterface;
  _count?: {};
}
