import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfigService } from '../config/app-config.service';
import { ShortlistBoxComponent } from '../shared/modal-box/shortlist-box/shortlist-box.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public IsWait = false;

  constructor(
    private snackBar: MatSnackBar,
    private appConfig: AppConfigService,
    private matDialog: MatDialog,
    private http: HttpClient) { }

  success(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500,
      verticalPosition: 'top',
      panelClass: ['success-bg-color']
    });
  }

  error(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['warn-bg-color']
    });
  }

  showLoader() {
    this.IsWait = true;
  }

  hideLoader() {
    this.IsWait = false;
  }

  // this will be replaced by actual hash post-build.js
private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
/**
* Checks in every set frequency the version of frontend application
* @param url
* @param {number} frequency - in milliseconds, defaults to 30 minutes
*/
public initVersionCheck(url, frequency = 1000 * 600 * 2) {
setInterval(() => {
  this.checkVersion(url);
}, frequency);
// this.checkVersion(url);
}
/**
* Will do the call and check if the hash has changed or not
* @param url
*/
private checkVersion(url) {
// timestamp these requests to invalidate caches
this.http.get(url + '?t=' + new Date().getTime())
.subscribe(
(response: any) => {
  console.log('response', response);
  console.log('current hash', this.currentHash);
  
const hash = response.hash;
const hashChanged = this.hasHashChanged(this.currentHash, hash);
// If new version, do something
if (hashChanged) {
// ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
// for an example: location.reload();
console.log('hash changed', hashChanged);
  // this.appConfig.warningWithTitle('Page will be reloaded automatically in 10 seconds', 'Version update');
  setTimeout(() => {    
    const data = {
      update: 'update-available'
    };
    if (this.matDialog.openDialogs.length == 0) {
      this.openDialog(ShortlistBoxComponent, data);
    }
  }, 0);
}
// store the new hash so we wouldn't trigger versionChange again
// only necessary in case you did not force refresh
this.currentHash = hash;
},
(err) => {
console.error(err, 'Could not get version');
}
);
}
/**
* Checks if hash has changed.
* This file has the JS hash, if it is a different one than in the version.json
* we are dealing with version change
* @param currentHash
* @param newHash
* @returns {boolean}
*/
private hasHashChanged(currentHash, newHash) {
if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
return false;
}
return currentHash !== newHash;
}

  // Open dailog
  openDialog(component, data) {
    let dialogDetails: any;

    // dialogDetails = {
    //   iconName: data.iconName,
    //   showCancel: data.showCancel,
    //   showConfirm: data.showConfirm,
    //   showOk: data.showOk,
    //   dataToBeShared: data.sharedData,
    // };

    /**
     * Dialog modal window
     */
    // tslint:disable-next-line: one-variable-per-declaration
    const dialogRef = this.matDialog.open(component, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      disableClose: true,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result == 'update') {          
              window.location.reload(true);
        }
      }
    });
  }

}
