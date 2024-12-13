import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { FeathersService } from '../../services/api/feathers.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GameService } from '../../services/game/game.service';
import { Game } from '../../shared/models/game.model';

interface ScoreForm {
  game: FormControl,
  password: FormControl,
}


@Component({
  selector: 'app-scorecard',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatStepperModule, MatRadioModule],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent {
  scoreForm: FormGroup<ScoreForm>
  games: Game[] = []

  constructor(
    private _feathers: FeathersService,
    private gameService: GameService
  ) {
    this.scoreForm = new FormGroup<ScoreForm>({
      game: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    })
  }

  ngOnInit() {
    this.gameService.getGames().subscribe((games)=>{
      this.games = games
      console.log(games)
    })
  }
  submitForm(){
    if(this.scoreForm.valid) {
      const selectedGame = this.scoreForm.get('game')?.value
      const password = this.scoreForm.get('password')?.value

      this._feathers.service('games').find({
        _id: selectedGame,
        password: password
      }).then((data: any) => {
        console.log(data)
      })
    }

  }
}

