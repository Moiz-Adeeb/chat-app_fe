import { inject, Pipe, PipeTransform } from '@angular/core';
import { distinctUntilChanged, map, Observable, of } from 'rxjs';
import { OnlineService } from '../services/online.service';

@Pipe({
  name: 'isOnline',
  pure: true,
  standalone: true
})
export class OnlineStatusPipe implements PipeTransform {
  private onlineService = inject(OnlineService);

  transform(chatId: string | undefined): Observable<boolean> {
    if (!chatId) return of(false); // return a static observable if no ID

    return this.onlineService.onlineUsers$.pipe(
      map(set => set.has(chatId.toLowerCase().trim())),
      distinctUntilChanged() // Only emit if the status actually FLIPS
    );
  }
}