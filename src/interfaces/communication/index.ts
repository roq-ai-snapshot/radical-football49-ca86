import { UserInterface } from 'interfaces/user';

export interface CommunicationInterface {
  id?: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  timestamp: Date;

  user_communication_sender_idTouser?: UserInterface;
  user_communication_receiver_idTouser?: UserInterface;
  _count?: {};
}
