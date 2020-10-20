import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';
import { GiphyService } from '../shared/giphy/giphy.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: Array<any>;

  currentOwner = null;
  currentIndex = -1;
  sort = '';

  page = 1;
  count = 0;
  pageSize = 9;
  pageSizes = [3, 6, 9];

  constructor(private ownerService: OwnerService, private giphyService: GiphyService) { }

  ngOnInit() {
    this.retrieveOwners();
  }

  getRequestParams(page, pageSize, sort) {

    let params = {};

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    if (sort) {
      params[`sort`] = sort;
    }

    return params;
  }

  retrieveOwners() {
    const params = this.getRequestParams(this.page, this.pageSize, this.sort);

    this.ownerService.getAll(params)
      .subscribe(
        response => { 
          this.owners = response._embedded.owners;
          for (const owner of this.owners) {
            this.giphyService.get(owner.name).subscribe(url => owner.giphyUrl = url);
          }         
        });
  }

  handlePageChange(event) {
    this.page = event;
    this.retrieveOwners();
  }

  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveOwners();
  }

}
