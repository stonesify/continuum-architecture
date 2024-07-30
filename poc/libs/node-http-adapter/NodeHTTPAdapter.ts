import { IncomingMessage } from 'node:http'
import { IncomingHttpEvent } from './events/IncomingHttpEvent';
import { OutgoingHttpEvent } from './events/OutgoingHttpEvent';
import { BaseAdapter } from '../../core/integration/BaseAdapter'
import { PlatformResponse } from '../../core/integration/interfaces';

export class NodeHTTPAdapter extends BaseAdapter<IncomingMessage, IncomingHttpEvent, PlatformResponse, OutgoingHttpEvent> {
  
}