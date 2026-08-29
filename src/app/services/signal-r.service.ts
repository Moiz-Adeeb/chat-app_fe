import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ILogger, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, filter, firstValueFrom, Observable, Subject, take } from 'rxjs';
import { AuthService } from './auth.service';
import { EndpointFactoryService } from './endpoint-factory.service';

class CustomSignalRLogger implements ILogger {
  log(logLevel: LogLevel, message: string): void { }
}

@Injectable({
  providedIn: 'root',
})
export class SignalRService extends EndpointFactoryService {

  authService: AuthService = inject(AuthService);
  timerId: any = null;

  // Check if the Hub is Already Connected or is Connecting
  isConnected = false;
  isConnecting = false;
  private isListenersSet = false;
  hubConnection!: signalR.HubConnection;
  private connectionStarted$ = new BehaviorSubject<boolean>(false);

  // Hub URL on the Back-End
  private readonly url = this.configurations.baseUrl + '/chat';
  private option: signalR.IHttpConnectionOptions = {
    // Getting the Acces Token for Authentication and Authorization
    accessTokenFactory: () => this.accessToken,
  };

  // init() {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(this.url, this.option)
  //     .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
  //     .configureLogging(new CustomSignalRLogger())
  //     .build();
  //   this.addListeners();
  // }

  // Initial Handshake
  init() {
    if (this.hubConnection) return;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url, {
        ...this.option,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true
      })
      .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
      .configureLogging(new CustomSignalRLogger())
      .build();

    this.addListeners();
  }

  // Connecitng to the SignalR-Hub
  connect() {
    if (this.isConnected || !this.hubConnection) {
      return;
    }
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.isConnected = true;
      })
      .catch((err) => {
        console.error('SignalR Connection Error:', err);
        this.isConnected = false;
      });
  }

  // async connect(): Promise<void> {
  //   if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

  //   try {
  //     await this.hubConnection.start();
  //     console.log('SignalR Connected Successfully');
  //     this.connectionStarted$.next(true); // TURN ON THE GREEN LIGHT
  //   } catch (err) {
  //     console.error('SignalR Connection Error:', err);
  //     this.connectionStarted$.next(false);
  //     throw err;
  //   }
  // }

  //Ensures we never send data while disconnected
  public async waitForConnection(): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    await firstValueFrom(
      this.connectionStarted$.pipe(
        filter(started => started === true),
        take(1)
      )
    );
  }

  // Disconnecting from the SignalR-Hub
  disconnect() {
    this.isListenersSet = false;
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => {
          this.isConnected = false;
          console.log('SignalR disconnected successfully');
        })
        .catch((err) => {
          console.error('Error disconnecting SignalR:', err);
          this.isConnected = false;
        });
    } else {
      this.isConnected = false;
    }
  }


  // Add All The Listeners for the hub to Listen to
  addListeners() {
    if (this.isListenersSet || !this.hubConnection) {
      return;
    }
    this.isListenersSet = true;

    // Closing the SignalR Connection
    this.hubConnection.onclose(() => {
      this.isConnected = false;
      console.log('SignalR Connection Closed');
    });
  }
}
