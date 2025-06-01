import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeathersService } from '../../services/api/feathers.service';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent {
  code: string = '';
  status: 'pending' | 'success' | 'already' | 'error' = 'pending';

  constructor(
    private route: ActivatedRoute,
    private feathers: FeathersService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('verify');
    // 1) Read the "code" from URL
    this.code = this.route.snapshot.paramMap.get('code') || '';
    if (!this.code) {
      this.status = 'already';
      return;
    }

    // 2) Call your Feathers backend to verify/consume the code
    //    Here I assume your Feathers server exposes a REST endpoint at
    //      GET http://<api-host>/verify-code/:code
    //    which returns { valid: true } or { valid: false }.
    //    Adjust the URL/response shape to match your actual API.
    await this.feathers.reauthenticate();
    this.feathers
      .service('codes')
      .find({
        query: {
          code: this.code,
        },
      })
      .then((data: any) => {
        let result = data.data;

        if (result.length > 1) {
          console.error('too many codes found');
        }

        if (result.length === 1) {
          if (result[0].used === false) {
            this.feathers
              .service('codes')
              .patch(result[0]._id, {
                used: true,
              })
              .then((res: any) => {
              
                if (res.used && res.used == true) {
                  this.status = 'success';
                }
              });
          } else {
            this.status = 'already'
          }
        }
      });
  }
}
