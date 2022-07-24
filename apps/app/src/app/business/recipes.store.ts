import { Injectable } from '@angular/core';

import { WebSocketService } from './socket';

@Injectable({
  providedIn: 'root',
})
export class RecipesStore {
  constructor(private socketService: WebSocketService) {}

  public async loadReceipts() {
    console.log('leadReceipts');
    await this.socketService.init;
    console.log('leadReceipts', 'resolve');
    this.socketService.socket.emit('recipt:list', {}, (re: any) => {
      console.log(re);
    });
  }

  //   private getWithCompleted(completed: boolean) {
  //     return this.todos.filter((todo: Todo) => todo.completed === completed);
  //   }

  //   allCompleted() {
  //     return this.todos.length === this.getCompleted().length;
  //   }

  //   setAllTo(completed: boolean) {
  //     this.todos.forEach(todo => {
  //       todo.completed = completed;
  //       todo.synced = false;
  //       this.socket.emit("todo:update", todo, (res) => {
  //         if (res && "error" in res) {
  //           // handle the error
  //           return;
  //         }
  //         todo.synced = true;
  //       });
  //     });
  //   }

  //   removeCompleted() {
  //     this.getCompleted().forEach((todo) => {
  //       this.socket.emit("todo:delete", todo.id, (res) => {
  //         if (res && "error" in res) {
  //           // handle the error
  //         }
  //       });
  //     })
  //     this.todos = this.getRemaining();
  //   }

  //   getRemaining() {
  //     return this.getWithCompleted(false);
  //   }

  //   getCompleted() {
  //     return this.getWithCompleted(true);
  //   }

  //   toggleCompletion(todo: Todo) {
  //     todo.completed = !todo.completed;
  //     todo.synced = false;
  //     this.socket.emit("todo:update", todo, (res) => {
  //       if (res && "error" in res) {
  //         // handle the error
  //         return;
  //       }
  //       todo.synced = true;
  //     })
  //   }

  //   remove(todo: Todo) {
  //     this.todos.splice(this.todos.indexOf(todo), 1);
  //     this.socket.emit("todo:delete", todo.id, (res) => {
  //       if (res && "error" in res) {
  //         // handle the error
  //       }
  //     });
  //   }

  //   add(title: string) {
  //     this.socket.emit("todo:create", { title, completed: false }, (res) => {
  //       if ("error" in res) {
  //         // handle the error
  //         return;
  //       }
  //       this.todos.push({
  //         id: res.data,
  //         title,
  //         completed: false,
  //         editing: false,
  //         synced: true
  //       });
  //     });
  //   }
}
