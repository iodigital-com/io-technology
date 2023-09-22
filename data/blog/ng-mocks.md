---
title: 'Speedup unit-tests development in Angular with NG-Mocks and CodiumAI'
date: '2023-09-18'
tags: ['frontend', 'angular', 'unit-tests', 'ng-mocks']
summary: There are multiple ways to speedup unit-tests development in Angular. Let me show you couple of ways how to make that happen.
authors: ['alexey-ses']
theme: 'blue'
---

## Why it takes so much time to create unit-tests?

Unit-tests creation takes time. One of the things that takes a lot of that time is mocking all the dependencies. Angular CLI doesn't help you a lot, because it only generates initial `.spec` file with TestBed configuration for each entity. So how can you speedup unit-tests development in Angular?

## Mock the dependencies with NG-Mocks library

[NG-Mocks](https://ng-mocks.sudo.eu/) is testing library which helps to mock all the dependencies. It has plenty of helper functions to speedup unit-tests development. Let's dive deep into some of those functions.

### Speedup TestBed module configuration with ngMocks.guts

Each component or service might depend on other components, services and declarations. Here's an example of basic service that depends on HttpClient and Router:

```typescript
// import ...

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  loginUserAndRedirect() {
    return this.http.post('http://localhost:4200/', 'some payload').pipe(
      switchMap(() => {
        this.router.navigate(['/dashboard'])
        return of(true)
      })
    )
  }
}
```

And here's unit-test for that service that inject dependencies using TestBed module configuration:

```typescript
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { Router } from '@angular/router'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(AuthService)
  })

  it('should send a POST request to the server and navigate to "/dashboard" on success', () => {
    const httpMock = TestBed.inject(HttpTestingController)
    const router = TestBed.inject(Router)
    const navigateSpy = spyOn(router, 'navigate')
    service.loginUserAndRedirect().subscribe()

    const req = httpMock.expectOne('http://localhost:4200/')
    expect(req.request.method).toBe('POST')
    req.flush({}) // Simulate a successful response

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard'])
  })
})
```

Have you noticed that I injected some of the dependencies and "spy" in the test itself? The reason is that it's the only test in this service and those dependencies might never be used in other tests in this `.spec` file. That approach should be more maintainable as this `.spec` file grows. You can read more about it: [Proposal how to write tests in Angular](https://ng-mocks.sudo.eu/extra/how-to-write-tests)

Let's go back to the TestBed configuration and use ngMocks.guts to generate metadata for TestBed module. We only have to pass single parameter to ngMocks.guts which is HttpClientTestingModule. It will be imported as it is without mocking:

```typescript
beforeEach(() => {
  const testBed = TestBed.configureTestingModule(ngMocks.guts(HttpClientTestingModule))
  service = TestBed.inject(AuthService)

  return testBed
})
```

Here's note from the official docs:

> ngMocks.guts works like that: it accepts 3 parameters, each one is optional.
>
> - 1st parameter accepts things we want to test as they are, these won't be mocked.
> - 2nd parameter accepts dependencies of the things. These dependencies will be mocked. In the case of modules, their imports, declarations and providers (guts) will be mocked.
> - 3rd parameter accepts things which should be excluded from the dependencies to provide sophisticated mocks later.

You can benefit from using ngMocks.guts more as you have more and more dependencies.

### Use ngMocks.autoSpy to spy on each method of dependencies

You could have fewer lines of code by configuring [ngMocks.autoSpy](https://ng-mocks.sudo.eu/extra/auto-spy) which would spy on each method of dependencies in your tests. To do that add the next code to `src/test.ts`:

```typescript title="src/test.ts"
import { ngMocks } from 'ng-mocks'

ngMocks.autoSpy('jasmine')
```

## Use Codium.Ai to generate unit-tests

There is another tool that could further speedup unit-tests development using ChatGPT which is called [Codium.Ai](https://www.codium.ai/). I've tested it as plugin for two different IDEs: Intellij Idea and VS Code. It doesn't generate the whole class, but at least it provides specific tests to copy-paste into the `.spec` file.

### Codium.Ai and Intellij Idea

To install CodiumAi in Intellij Idea, go to Settings -> Plugins -> search for it, install and restart Intellij Idea:

![How to install CodiumAi in Intellij Idea](/articles/ng-mocks/codium-ai-install-intellij.webp)

Now you have additional side panel in right part of the Intellij Idea and you have to Sign In to one of your accounts in order to use it.

After that you can finally generate the tests:

- (1) Click the text above the component/service name that you want your tests to be generated for
- (2) Type "use "ng-mocks" testing library" in the "General instructions" input field
- (3) Press "Regenerate" button
- (4) Copy the result into the `.spec` file

![CodiumAi usage in Intellij Idea](/articles/ng-mocks/codium-ai-usage-intellij.webp)

### Codium.Ai and VS Code

To install CodiumAi in VS Code, go to Extensions -> search for it and install:

![How to install CodiumAi in VS Code](/articles/ng-mocks/codium-ai-install-vscode.webp)

As soon as this extension is installed you have to Sign In to one of your accounts in order to use it.

After that you can finally generate the tests:

- (1) Click the text above the component/service name that you want your tests to be generated for
- (2) Type "use "ng-mocks" testing library" in the "General instructions" input field
- (3) Press "Regenerate" button
- (4) Copy the result into the `.spec` file

![CodiumAi usage in VS Code](/articles/ng-mocks/codium-ai-usage-vscode.webp)

## Conclusion

I hope those tools would speedup unit-test development. Happy coding!
