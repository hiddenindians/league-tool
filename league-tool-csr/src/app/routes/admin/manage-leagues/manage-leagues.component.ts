import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../../../services/game/game.service';
import { AuthService } from '../../../services/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Game } from '../../../shared/models/game.model';
import { League } from '../../../shared/models/league.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manage-leagues',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatListModule,
    MatChipsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  templateUrl: './manage-leagues.component.html',
  styleUrl: './manage-leagues.component.scss',
})
export class ManageLeaguesComponent {
  leagueForm: FormGroup;
  gameForm: FormGroup;
  games: Game[] = [];
  isLoading: boolean = false;
  selectedGame: Game | null = null;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      active: [true],
    });
    this.leagueForm = this.fb.group({
      name: ['', Validators.required],
      active: [true],
    });
  }
  ngOnInit() {
    this.loadGames()
  }
  
  async loadGames() {
    this.isLoading = true;
    try {
      this.gameService.getGames().subscribe((games: any)=> {
        this.games = games
      });
    } catch (error) {
      this.showError('Error loading games');
    } finally {
      this.isLoading = false;
    }
  }

  async createGame() {
    if (this.gameForm.valid) {
      this.isLoading = true;
      try {
        console.log((this.gameForm.value))
        const newGame = await this.gameService.createGame({
          ...this.gameForm.value,
          leagues: []
        });
        //this.games.push(newGame);
        this.gameForm.reset({active: true});
        this.showSuccess('Game created successfully');
      } catch (error) {
        this.showError('Error creating game');
      } finally {
        this.isLoading = false;
      }
    }
  }

  selectGame(game: Game) {
    this.selectedGame = game;
    this.leagueForm.reset({active: true});
  }

  async addLeague() {
    if (this.leagueForm.valid && this.selectedGame) {
      this.isLoading = true;
      try {
        const newLeague: League = {
          ...this.leagueForm.value,
          seasons: []
        };
        
        const updatedGame = await this.gameService.patch(this.selectedGame._id, {
          leagues: [...this.selectedGame.leagues, newLeague]
        });

        const gameIndex = this.games.findIndex(g => g._id === this.selectedGame?._id);
        if (gameIndex !== -1) {
          this.games[gameIndex] = updatedGame;
          this.selectedGame = updatedGame;
        }

        this.leagueForm.reset({active: true});
        this.showSuccess('League added successfully');
      } catch (error) {
        this.showError('Error adding league');
      } finally {
        this.isLoading = false;
      }
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
