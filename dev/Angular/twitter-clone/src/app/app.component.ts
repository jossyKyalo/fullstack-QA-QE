import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  username: string;
  name: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',  
})
export class AppComponent implements OnInit {
  users: User[] = [];
  posts: Post[] = [];
  comments: Comment[] = [];

  selectedUserId: number = 1;
  selectedPostId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }
  get selectedUser() {
    return this.users.find(user => user.id === this.selectedUserId);
  }
  fetchUsers() {
    this.http.get<User[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe({
        next: (users) => {
          this.users = users;
          if (users.length > 0) {
            this.selectedUserId = users[0].id;
            this.fetchPosts();
          }
        },
        error: (err) => console.error('Error fetching users', err),
      });
  }

  fetchPosts() {
    this.http.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${this.selectedUserId}`)
      .subscribe({
        next: (posts) => {
          this.posts = posts;
          if (posts.length > 0) {
            this.selectedPostId = posts[0].id;
            this.fetchComments();
          }
        },
        error: (err) => console.error('Error fetching posts', err),
      });
  }

  fetchComments() {
    if (!this.selectedPostId) return;

    this.http.get<Comment[]>(`https://jsonplaceholder.typicode.com/comments?postId=${this.selectedPostId}`)
      .subscribe({
        next: (comments) => {
          this.comments = comments;
        },
        error: (err) => console.error('Error fetching comments', err),
      });
  }

  onUserChange() {
    this.fetchPosts();
  }

  onPostChange() {
    this.fetchComments();
  }
   
}