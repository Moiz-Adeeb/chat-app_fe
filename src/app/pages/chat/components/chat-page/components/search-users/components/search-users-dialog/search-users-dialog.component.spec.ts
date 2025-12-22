import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUsersDialogComponent } from './search-users-dialog.component';

describe('SearchUsersDialogComponent', () => {
  let component: SearchUsersDialogComponent;
  let fixture: ComponentFixture<SearchUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUsersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
