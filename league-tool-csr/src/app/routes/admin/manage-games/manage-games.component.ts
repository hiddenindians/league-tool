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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Game } from '../../../shared/models/game.model';
import { League } from '../../../shared/models/game.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-manage-games',
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
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './manage-games.component.html',
  styleUrl: './manage-games.component.scss',
})
export class ManageGamesComponent {
  gameForm: FormGroup;
  leagueForm: FormGroup;
  games: Game[] = [];
  isLoading: boolean = false;
  selectedGame: Game | null = null;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      active: [true],
    });

    this.leagueForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      active: [true]
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
  }

  private refreshGameData() {
    if (this.selectedGame) {
      this.gameService.getGame(this.selectedGame._id).then((updatedGame: any) => {
        this.selectedGame = updatedGame;
        // Also update the game in the games array
        const index = this.games.findIndex(g => g._id === updatedGame._id);
        if (index !== -1) {
          this.games[index] = updatedGame;
        }
      });
    }
  }

  navigateToLeagues(game: Game){
    this.selectedGame = game;
    // Uncomment the league management section in the HTML
    
    // Optional: Scroll to the leagues section
    setTimeout(() => {
      const leaguesSection = document.querySelector('.add-league-section');
      leaguesSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  manageSeasons(league: League) {
    // Navigate to seasons management view
  }

  viewGameDetails(game: Game){
    this.selectedGame = game
  }

  addLeague() {
    if (this.leagueForm.valid && this.selectedGame) {
      const newLeague: Partial<League> = {
        name: this.leagueForm.value.name,
        active: this.leagueForm.value.active,
        seasons: []
      };

      // Update the game with the new league
      this.gameService.patch(this.selectedGame._id, {
        $push: { leagues: newLeague }
      }).then(() => {
        this.snackBar.open('League added successfully', 'Close', {
          duration: 3000
        });
        this.leagueForm.reset({ active: true });
        // Refresh the selected game data
        this.refreshGameData();
      }).catch(error => {
        this.snackBar.open('Error adding league', 'Close', {
          duration: 3000
        });
      });
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
