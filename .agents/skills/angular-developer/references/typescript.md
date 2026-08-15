# TypeScript Guidelines

TypeScript is a language used to write Angular applications.

## General TypeScript Guidelines

- NEVER use type `any`.

## TypeScript Class Methods

- All class methods should be defined as `readonly` arrow function expressions.
- Methods which are only used inside the class should be marked as `private`.
- Private methods should NEVER be tested directly in unit tests.

Example:

```ts
export class Profile {
  readonly save = (data: string): boolean => {
    if(!this.isDataValid(data)) {
      return false;
    }
    
    /* ... */
  }
  
  private readonly isDataValid = (data: string): boolean => {
    return data.length > 0;
  }
}
```

## TypeScript Class Properties

- Avoid using mutable properties.
- All class properties should be defined as `readonly` unless they are mutable.

Example:

```ts
@Component({
  selector: 'air-button',
  imports: [ CommonModule ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');

  readonly disabled = input<boolean>(false);
}
```
