import { Component, OnInit } from '@angular/core';
import { Role } from '../role';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: Role[];

  constructor(private roleService: RoleService) {
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles(): void {
    this.roleService.getRoles()
      .subscribe(roles => this.roles = roles);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.roleService.addRole({ name} as Role)
      .subscribe(role => {
        this.roles.push(role);
      });
  }

  delete(role: Role): void {
    this.roles = this.roles.filter(h => h !== role);
    this.roleService.deleteRole(role).subscribe();
  }
}
