import { SoundService } from './../core/sound.service';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

interface ChatMessage {
  from: string;
  to: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  public receivedMessages: ChatMessage[] = [];
  private topicSubscription: Subscription;
  public message: string;

  @Input()
  protected username: string;
  @Input()
  protected me: string;

  @Input()
  public enabled: boolean;

  @Output()
  protected enabledChange = new EventEmitter<boolean>();

  constructor(private rxStompService: RxStompService, private soundService: SoundService) {
  }

  ngOnInit() {
    this.connect();
    this.enabled = true;
  }

  connect() {
    this.topicSubscription = this.rxStompService.watch('/user/exchange/amq.direct/chat').subscribe((message: Message) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      this.soundService.doSocialNotificationSound();
      this.receivedMessages.push(chatMessage);
    });
  }

  disconnect(){
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }
  onSendMessage() {
    const chatMessage: ChatMessage = { message: this.message, to: this.username, from: this.me };
    this.rxStompService.publish({
      destination: '/app/chat', body:
        JSON.stringify({ from: this.me, message: this.message, to: this.username })
    });
    this.message = '';
    this.receivedMessages.push(chatMessage);
  }

  ngOnDestroy() {
    this.disconnect();
  }

  toggleEnabled(){
    if (this.enabled){
      this.enabled = false;
      this.disconnect();
      this.enabledChange.emit(false);
    }

  }
}
