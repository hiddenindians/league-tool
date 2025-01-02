import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../../services/game/game.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-manage-leagues',
  imports: [],
  templateUrl: './manage-leagues.component.html',
  styleUrl: './manage-leagues.component.scss'
})
export class ManageLeaguesComponent {
  leagueForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private auth: AuthService,
    
  ){
    this.leagueForm = this.fb.group({
      name: ['', Validators.required],
      active: ['', Validators.required],
      
    })
  }
}
