---
title: 'Speedup unit-tests development in Angular with NG-Mocks'
date: '2023-09-28'
tags: ['frontend', 'angular', 'unit-tests']
images: ['/articles/ng-mocks/ng-mocks-cover.png']
summary: 'There are multiple ways to speedup unit-tests development in Angular. Let me show you one of them.'
authors: ['alexey-ses']
theme: 'blue'
---

## Why it takes so much time to create unit-tests?

Unit-tests are important part of any application. But development of robust unit-tests takes time. One of the things that takes a lot of that time is mocking all the dependencies. Angular CLI doesn't help you a lot, because it only generates initial `.spec` file with default TestBed configuration. So how can you speedup unit-tests development in Angular?

## Mock the dependencies with NG-Mocks library

[NG-Mocks](https://ng-mocks.sudo.eu/) is testing library which helps to mock all the dependencies. It has plenty of helper functions that would be useful as well.

### Speedup TestBed module configuration with MockProvider function

Each component or service might depend on other components and services. Here's an example of service that depends on HttpClient, Router and OAuthService:

```typescript:auth.service.ts
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private oauthService: OAuthService,
    ) {
        this.configureSSO();
    }

    /**
     * OAuthService needs to be configured in order to use it's Single Sign-On feature
     */
    private configureSSO() {
        this.oauthService.configure(authConfig);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }

    loginWithSSO(): void {
        // ...
    }

    logoutWithSSO(): void {
        // ...
    }

    loginUserAndRedirect(): Observable<boolean> {
        return this.http.post('http://localhost:4200/', 'some payload').pipe(
            switchMap(() => {
                this.router.navigate(['/dashboard']);
                return of(true);
            }),
        );
    }
}
```

Let's implement tests config for that service. The default approach would be to use `TestBed.configureTestingModule()` function to configure all the dependencies. What needs be passed into that function:

1. `HttpClientTestingModule`, which configures HttpClientTestingBackend used by HttpClient.
2. Mock of `OAuthService`.

```typescript:auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let router: Router;
  let httpMock: HttpTestingController;
  let oAuthService: OAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: OAuthService,
          useValue: {
            configure: () => {},
            loadDiscoveryDocumentAndTryLogin: () => {},
            tokenValidationHandler: new JwksValidationHandler(),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    oAuthService = TestBed.inject(OAuthService);
    service = TestBed.inject(AuthService);
  });
});
```

At least two tests needs to be added. Both of them would contain `spyOn` functions to detect when specific method gets called on instance of specific class:

```typescript:auth.service.spec.ts
describe('AuthService', () => {
    let service: AuthService;
    let router: Router;
    let httpMock: HttpTestingController;
    let oAuthService: OAuthService;

    beforeEach(() => {...});

    it('should configure SSO on initialization ', () => {
        // Arrange
        const configureSpy = spyOn(oAuthService, 'configure');
        const tokenValidationHandlerSpy = spyOnProperty(oAuthService, 'tokenValidationHandler', 'set');
        const loadDiscoveryDocumentAndTryLoginSpy = spyOn(oAuthService, 'loadDiscoveryDocumentAndTryLogin');
        const httpClientSpy: HttpClient = jasmine.createSpyObj(['post']);

        // Act
        new AuthService(httpClientSpy, router, oAuthService);

        // Assert
        expect(configureSpy).toHaveBeenCalledWith(authConfig);
        expect(tokenValidationHandlerSpy).toEqual(new JwksValidationHandler());
        expect(loadDiscoveryDocumentAndTryLoginSpy).toHaveBeenCalled();
    });

    it('should send a POST request to the server and navigate to "/dashboard" on success', () => {
        // Arrange
        const navigateSpy = spyOn(router, 'navigate');

        // Act
        service.loginUserAndRedirect().subscribe();

        // Assert
        const req = httpMock.expectOne('http://localhost:4200/');
        expect(req.request.method).toBe('POST');
        req.flush({}); // Simulate a successful response

        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    });
});
```

Now let's replace mock of OAuthService in TestBed with ng-mocks `MockProvider` helper function:

```typescript:auth.service.spec.ts

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [MockProvider(OAuthService)],
    });

    //...
});
```

`MockProvider(OAuthService)` creates empty dummies as methods of OAuthService which is totally ok for implemented tests.

### Spy all methods of services using ngMocks.autoSpy

[ngMocks.autoSpy](https://ng-mocks.sudo.eu/extra/auto-spy) is awesome feature if you want to get rid of all spied methods in your tests. In order to use it in the specific test, it needs to be added on top of the `.spec` file:

```typescript:auth.service.spec.ts
ngMocks.autoSpy('jasmine');

describe('AuthService', () => {
    //...
})
```

After that tests needs to be updated:

```typescript:auth.service.spec.ts
ngMocks.autoSpy('jasmine');

describe('AuthService', () => {
    let service: AuthService;
    let router: Router;
    let httpMock: HttpTestingController;
    let oAuthService: OAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MockProvider(OAuthService), MockProvider(Router)],
        });

        router = TestBed.inject(Router);
        httpMock = TestBed.inject(HttpTestingController);
        oAuthService = TestBed.inject(OAuthService);
        service = TestBed.inject(AuthService);
    });

    it('should configure SSO on initialization ', () => {
        // Assert
        expect(oAuthService.configure).toHaveBeenCalledWith(authConfig);
        expect(oAuthService.tokenValidationHandler).toEqual(new JwksValidationHandler());
        expect(oAuthService.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalled();
    });

    it('should send a POST request to the server and navigate to "/dashboard" on success', () => {
        // Act
        service.loginUserAndRedirect().subscribe();

        // Assert
        const req = httpMock.expectOne('http://localhost:4200/');
        expect(req.request.method).toBe('POST');
        req.flush({}); // Simulate a successful response

        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
});
```

As you can see, now it's a bit less code in the tests.

## Make tests more maintainable

One more exciting thing from ng-mocks is proposal on [how to make tests more maintainable](https://ng-mocks.sudo.eu/extra/how-to-write-tests). The idea is to write tests without scoped variables. Basically specific arrangements need to be applied to specific tests, so that each test is self-sufficient and does not rely on scoped variables:

```typescript:auth.service.spec.ts
ngMocks.autoSpy('jasmine');

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MockProvider(OAuthService), MockProvider(Router)],
        });

        service = TestBed.inject(AuthService);
    });

    it('should configure SSO on initialization ', () => {
        // Arrange
        const oAuthService = TestBed.inject(OAuthService);

        // Assert
        expect(oAuthService.configure).toHaveBeenCalledWith(authConfig);
        expect(oAuthService.tokenValidationHandler).toEqual(new JwksValidationHandler());
        expect(oAuthService.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalled();
    });

    it('should send a POST request to the server and navigate to "/dashboard" on success', () => {
        // Arrange
        const httpMock = TestBed.inject(HttpTestingController);
        const router = TestBed.inject(Router);

        // Act
        service.loginUserAndRedirect().subscribe();

        // Assert
        const req = httpMock.expectOne('http://localhost:4200/');
        expect(req.request.method).toBe('POST');
        req.flush({}); // Simulate a successful response

        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
});
```

## Conclusion

I hope NG-Mocks would help you with unit-test development and improve your overall developer experience as you create Angular applications. Happy coding!
