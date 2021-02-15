import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { configf } from './config/conf';
import { Config } from './config/config';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { AuthModule, OidcSecurityService, OidcConfigService, LogLevel, } from 'angular-auth-oidc-client';
import { PdbReaderComponent } from './pdb-reader/pdb-reader.component';
import { GeomDescriptors, PdbsonImplementation } from '@euclia/descriptors';
import { NgChemdoodleModule } from '@wcmc/ng-chemdoodle';
import { ModelsComponent } from './models/models.component';
import { MatDividerModule } from '@angular/material/divider';
import { PredictionsComponent } from './predictions/predictions.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  declarations: [
    AppComponent,
    PdbReaderComponent,
    ModelsComponent,
    PredictionsComponent
  ],
  imports: [
    NgChemdoodleModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    AuthModule.forRoot()
  ],
  providers: [OidcConfigService,OidcSecurityService , PdbsonImplementation,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService, HttpClient],
      multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }



export function configureAuth(oidcConfigService: OidcConfigService, httpClient: HttpClient) {
  const setupAction$ = httpClient.get<any>(`/assets/conf.json`).pipe(
      map((customConfig:configf) => {
        Config.NanoPotApi = customConfig.nanopotApi
        // Config.AccountsApi = customConfig.accountsApi
        // console.log("Accounts api at:")
        // console.log(Config.AccountsApi)
        // console.log(customConfig.stsServer)
          return {
              stsServer: customConfig.stsServer,              
              redirectUrl: customConfig.redirect_url,
              clientId: customConfig.client_id,
              responseType: customConfig.response_type,
              scope: customConfig.scope,
              // postLogoutRedirectUri: customConfig.baseurl,
              // startCheckSession: customConfig.start_checksession,
              // silentRenew: customConfig.silent_renew,
              silentRenewUrl: customConfig.silent_redirect_url,
              postLogoutRedirectUri: window.location.origin,
              // postLoginRoute: customConfig.baseurl,
              // forbiddenRoute: customConfig.baseurl,
              // unauthorizedRoute: customConfig.baseurl,
              logLevel: LogLevel.Debug, // LogLevel.Debug,
              maxIdTokenIatOffsetAllowedInSeconds: 120,
              historyCleanupOff: true,
              autoUserinfo: true,
              storage: localStorage
          };
      }),
      switchMap((config) => oidcConfigService.withConfig(config))
  );

  return () => setupAction$.toPromise();
}