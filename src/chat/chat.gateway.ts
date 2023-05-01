import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io'
import { sesson_message, desconected } from './chat.connection'
import { Messagem } from './chat.interfaces';
import { RedisIoAdapter } from '../adpters/redis.io.adpter'


@WebSocketGateway(8080)
export class ChatGateway {

  private list: Array<string> = new Array<string>;

  @WebSocketServer()
  server: Server;


  @SubscribeMessage('start_chat')
  startChat(@MessageBody() data: string) {
    const message: string = data
    console.log(`Inciada a sessão: ${data}`)
    if (this.list.indexOf(message) === -1) {
      this.list.push(message);
    }
    else {
      this.emit(sesson_message, "Sessão ja criada")
    }

  }

  @SubscribeMessage('end_chat')
  endChat(@MessageBody() data: string) {
    const index: number = this.list.indexOf(data);
    if (index !== -1) {
      this.list.slice(index, 1);
      console.log(`\nSessaõ: ${data}, removida`)
      this.emit(desconected, 'deslogado do chat')
    }
  }

  @SubscribeMessage('send_message')
  sendMessage(@MessageBody() data: Messagem,) {
    const sesson: string = this.list[this.list.indexOf(data.sesson)];
    console.log(`\nEnviando mensagem para sessão ${sesson} com a mensagem ${data.message}`);
    this.emit(sesson, data.message);
  }

  emit(action: string, data: any) {
    this.server.sockets.emit(action, data);
  }

}
