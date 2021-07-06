import { Component, OnInit } from '@angular/core';
import {CatalogService} from '../../services/catalog.service';
import {CodeModel} from '../../models/code.model';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  catalog: CodeModel[];
  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.catalogService.getCatalogue().subscribe(list => this.catalog = list);
  }

}
