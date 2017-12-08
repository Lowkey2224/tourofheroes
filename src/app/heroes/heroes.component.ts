import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  page = 1;

  constructor(private heroService: HeroService) {
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes(this.page)
      .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string, email: string, dateOfBirth: Date): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name, email, dateOfBirth } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }


  nextPage(): void {
    this.page = this.page + 1;
    this.heroes = [];
    this.getHeroes();
  }

  previousPage(): void {
    this.page = this.page <= 1 ? 1 : this.page - 1;
    this.heroes = [];
    this.getHeroes();
  }
}
