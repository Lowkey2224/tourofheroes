import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {HeroService} from '../hero.service';
import {Hero} from '../hero';
import {Role} from '../role';
import {RoleService} from '../role.service';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;
  roles: Role[];

  constructor(private route: ActivatedRoute,
              private heroService: HeroService,
              private roleService: RoleService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.getHero();
    this.getRoles();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  getRoles(): void {
    this.roleService.getRoles()
      .subscribe(roles => this.roles = roles);
  }

  hasRole(roleParam: Role): boolean {
    let result = false;
    for (const role of this.hero.roles) {
      if (role.id === roleParam.id) {
        result = true;
      }
    }

    return result;
  }

}
