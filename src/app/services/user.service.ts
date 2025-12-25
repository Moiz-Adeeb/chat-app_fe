import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { GetUsersResponseModel, UserClient, UsersDto } from "../api/api";

@Injectable({ 
    providedIn: 'root' 
})

export class UserService {

    private userSource = new BehaviorSubject<UsersDto[]>([]);
    public users$ = this.userSource.asObservable();

    private isLoadingSource = new BehaviorSubject<boolean>(false);
    public isLoadingMore$ = this.isLoadingSource.asObservable();

    private fullListLoadedSource = new BehaviorSubject<boolean>(false);
    public isFullListLoaded$ = this.fullListLoadedSource.asObservable();

    private userIdSet = new Set<string>();

    constructor(private userClient: UserClient) {}

    get isLoading(): boolean { return this.isLoadingSource.value; }
    get isFullLoaded(): boolean { return this.fullListLoadedSource.value; }


    fetchUsers(search: string, isDescending: boolean, page: number, pageSize: number): Observable<GetUsersResponseModel> {
        this.isLoadingSource.next(true);
        this.fullListLoadedSource.next(false);

        return this.userClient.getUsers(false, search, isDescending, page, pageSize, 'name').pipe(
            tap(result => {
                const data = result.data ?? [];
                
                this.userIdSet.clear();
                data.forEach(u => { if (u.chatId) this.userIdSet.add(u.chatId); });

                this.userSource.next(data);
                this.checkIfFull(result, data.length, pageSize);
                this.isLoadingSource.next(false);
            })
        );
    }

    loadMoreUsers(search: string, isDescending: boolean, page: number, pageSize: number): void {
        if (this.isLoading || this.isFullLoaded) return;

        this.isLoadingSource.next(true);

        this.userClient.getUsers(false, search, isDescending, page, pageSize, 'name').subscribe({
            next: (result) => {
                const newData = result.data ?? [];
                const currentList = this.userSource.value;

                const uniqueNewData = newData.filter(user => {
                    if (user.chatId && !this.userIdSet.has(user.chatId)) {
                        this.userIdSet.add(user.chatId);
                        return true;
                    }
                    return false;
                });

                this.userSource.next([...currentList, ...uniqueNewData]);
                this.checkIfFull(result, newData.length, pageSize);
                this.isLoadingSource.next(false);
            },
            error: () => this.isLoadingSource.next(false)
        });
    }

    private checkIfFull(result: GetUsersResponseModel, count: number, pageSize: number): void {
        const isLastPage = result.pagination?.page === result.pagination?.lastPage;
        const noMoreData = count < pageSize;
        
        if (isLastPage || noMoreData) {
            this.fullListLoadedSource.next(true);
        }
    }

    clearUsers(): void {
        this.userIdSet.clear();
        this.userSource.next([]);
        this.fullListLoadedSource.next(false);
        this.isLoadingSource.next(false);
    }
}