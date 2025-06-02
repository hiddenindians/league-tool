import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { FeathersService } from '../../services/api/feathers.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GameService } from '../../services/game/game.service';
import { Game } from '../../shared/models/game.model';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../shared/models/user.model';
import { Errors } from '../../shared/models/errors.model';
//import { RouterLink } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
interface ScoreForm {
  game: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-scorecard',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule,
    MatRadioModule,
    MatProgressSpinnerModule
   // RouterLink,
  ],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss',
})
export class ScorecardComponent {
  scoreForm: FormGroup<ScoreForm>;
  games: Game[] = [];
  currentUser: User | null = null;
  error: Errors = { message: '', errors: {} };
  points: number = 0;
  gameSubscription: any;
  userSubscription: any;

  constructor(
    private _feathers: FeathersService,
    private gameService: GameService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.scoreForm = new FormGroup<ScoreForm>({
      game: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  ngOnInit() {
    this.authService.reauthenticate();
    this.userSubscription = this.authService.currentUser.subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    );
    this.gameSubscription = this.gameService.getGames().subscribe((games) => {
      this.games = games;
    });
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.gameSubscription.unsubscribe();
  }
  hasUsedBonusCode(user: User, code: string): boolean {
    return user.bonus_codes_used?.some((entry: any) => entry.code === code);
  }
  submitForm() {
    if (this.scoreForm.valid) {
      const selectedGame = this.scoreForm.get('game')?.value;
      const password = this.scoreForm.get('password')?.value;

      if (!this.hasUsedBonusCode(this.currentUser as User, password)) {
        this._feathers
          .service('games')
          .find({
            query: {
              _id: selectedGame,
              password: password,
            },
          })
          .then((data: any) => {
            const array = data.data;
            if (array.length != 0) {
              const points = this.games.filter(
                (game) => game._id === selectedGame
              )[0].participation_points;

              try {
                this.userService
                  .updateBonusCodesUsed(
                    this.currentUser!._id,
                    password,
                    points,
                    'participation',
                    selectedGame,
                    this.currentUser!._id
                  )
                  .then(() => {
                    this.userService.addToTotalPoints(
                      this.currentUser!._id,
                      points
                    );
                    this.points = points;
                    this.authService.reauthenticate();
                  });
              } catch (error: any) {

                this.error = {
                  message: error.message,
                  errors: {}
                };
              }
            } else {
              this.error = {
                message: 'The code you entered is not valid.',
                errors: {},
              };
            }
          })
          .catch((err: any) => {
            this.error = {
              message: err.message,
              errors: {},
            };
          });
      } else {
        this.error = {
          message: "You've already used this code",
          errors: {},
        };
      }
    }
  }
}
