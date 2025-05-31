import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../../../services/game/game.service';
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
import { generateSlug } from 'random-word-slugs';
@Component({
  standalone: true,
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
    MatSnackBarModule,
    MatInputModule,
  ],
  templateUrl: './manage-games.component.html',
  styleUrl: './manage-games.component.scss',
})
export class ManageGamesComponent {
  gameForm: FormGroup;
  leagueForm: FormGroup;
  games: Game[] = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  selectedGame: Game | null = null;
  gameSubscription: any;
  

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
      active: [true],
    });
  }

  ngOnInit() {
    this.loadGames();
  }
  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
  async loadGames() {
    this.isLoading = true;
    try {
      this.gameSubscription = this.gameService.getGames().subscribe((games: any) => {
        this.games = games;
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
        console.log(this.gameForm.value);
        const newGame = await this.gameService.createGame({
          ...this.gameForm.value,
          leagues: [],
        });
        //this.games.push(newGame);
        this.gameForm.reset({ active: true });
        this.showSuccess('Game created successfully');
      } catch (error) {
        this.showError('Error creating game');
      } finally {
        this.isLoading = false;
      }
    }
  }

  cancelEdit(){
    
  }
  generatePassword(game: Game) {
    const randomNumber = Math.floor(Math.random() * (100 - 10)) + 10;

    const password =
      generateSlug(2, {
        format: 'title',
        partsOfSpeech: ['adjective', 'noun'],
        categories: {
          noun: ['animals', 'thing'],
          adjective: ['condition', 'personality'],
        },
      }).replace(' ', '') + `${randomNumber}`;

    this.snackBar.open(`Password for ${game.name}: ${password}`, 'Close', {
      duration: 4000,
    });

    this.gameService.setPassword(game._id, password);

    navigator.clipboard.writeText(password).catch(() => {
      this.showError('Could not copy password to clipboard');
    });
  }

  updateParticipationPoints(game: Game, value: number | string) {
    const parsed = Number(value);

    if (isNaN(parsed) || parsed < 0) {
      this.showError('Invalid point value');
      return;
    }

    this.gameService
      .patch(game._id, { participation_points: parsed })
      .then(() => {
        this.showSuccess(
          `${game.name} participation points updated to ${parsed}`
        );
        game.participation_points = parsed;
      })
      .catch(() => {
        this.showError('Failed to update participation points');
      });
  }
  onPointsBlur(event: Event, game: Game) {
    const input = event.target as HTMLInputElement;
    this.updateParticipationPoints(game, input.value);
  }
  selectGame(game: Game) {
    this.selectedGame = game;
  }

  // private refreshGameData() {
  //   if (this.selectedGame) {
  //    this.gameSubscription = this.gameService
  //       .getGame(this.selectedGame._id)
  //       .subscribe((updatedGame: any) => {
  //         this.selectedGame = updatedGame;
  //         // Also update the game in the games array
  //         const index = this.games.findIndex((g) => g._id === updatedGame._id);
  //         if (index !== -1) {
  //           this.games[index] = updatedGame;
  //         }
  //       });
  //   }
  // }

  navigateToLeagues(game: Game) {
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

  viewGameDetails(game: Game) {
    this.selectedGame = game;
  }

  // addLeague() {
  //   if (this.leagueForm.valid && this.selectedGame) {
  //     const newLeague: Partial<League> = {
  //       name: this.leagueForm.value.name,
  //       active: this.leagueForm.value.active,
  //       seasons: [],
  //     };

  //     // Update the game with the new league
  //     this.gameService
  //       .patch(this.selectedGame._id, {
  //         $push: { leagues: newLeague },
  //       })
  //       .then(() => {
  //         this.snackBar.open('League added successfully', 'Close', {
  //           duration: 3000,
  //         });
  //         this.leagueForm.reset({ active: true });
  //         // Refresh the selected game data
  //         this.refreshGameData();
  //       })
  //       .catch((error) => {
  //         this.snackBar.open('Error adding league', 'Close', {
  //           duration: 3000,
  //         });
  //       });
  //   }
  // }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
