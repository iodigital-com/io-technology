---
title: 'Speedup unit-tests development in Angular with NG-Mocks'
date: '2023-09-28'
tags: ['frontend', 'angular', 'unit-tests']
images: ['/articles/ng-mocks/ng-mocks-cover.png']
summary: 'There are multiple ways to speed up unit tests development in Angular. Let me show two of them using the NG-Mocks library.'
authors: ['alexey-ses']
theme: 'blue'
---

## Why does it take so much time to create unit tests?

Unit tests are an important part of any application. However, the development of robust unit tests takes time. One of the things that takes a lot of that time is mocking all the dependencies. Angular CLI doesn't help you a lot, because it only generates the initial `.spec` file with default TestBed configuration. So how can you speed up unit test development in Angular?

## Mock the dependencies with NG-Mocks library

[NG-Mocks](https://ng-mocks.sudo.eu/) is a testing library that helps to mock all the dependencies. It has plenty of helper functions. I would like to show you two of them that might help you the most.

### Speedup TestBed module configuration with MockProvider function

Each component or service might depend on other components and services. Here's an example of a service that depends on HttpClient, Router and OAuthService:

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
     * OAuthService needs to be configured in order to use its Single Sign-On feature
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

Let's implement the test config for that service. The default approach would be to use the `TestBed.configureTestingModule()` function to configure all the dependencies. What needs to be passed into that function:

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

At least two tests need to be added. Both of them would contain `spyOn` functions to detect when a specific method gets called on an instance of a specific class:

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

Now let's replace the mock of OAuthService in TestBed with NG-Mocks `MockProvider` helper function:

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

[ngMocks.autoSpy](https://ng-mocks.sudo.eu/extra/auto-spy) is an awesome feature if you want to get rid of all spied methods in your tests. In order to use it in the specific test, it needs to be added on top of the `.spec` file:

```typescript:auth.service.spec.ts
ngMocks.autoSpy('jasmine');

describe('AuthService', () => {
    //...
})
```

After that tests need to be updated:

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

One more exciting thing from NG-Mocks is a proposal on [how to make tests more maintainable](https://ng-mocks.sudo.eu/extra/how-to-write-tests). The idea is to write tests without scoped variables. Basically, specific arrangements need to be applied to specific tests so that each test is self-sufficient and does not rely on scoped variables:

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

Unit tests are updated and more maintainable.

## Conclusion

I hope NG-Mocks will help you with unit test development and improve your overall developer experience as you create Angular applications. Happy coding!
