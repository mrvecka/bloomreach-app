import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { UserEventProperties } from '../event-filter.types';
import { availableOperators } from '../services/customer-event-filter.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-funnel-filter-step-condition',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './funnel-filter-step-condition.component.html',
  styleUrl: './funnel-filter-step-condition.component.scss',
})
export class FunnelFilterStepConditionComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);

  private destroy$ = new Subject<void>();

  conditionIndex = input.required<number>();
  conditionGroup = input.required<FormGroup>();
  alreadyAssignedAttributes = input.required<string[]>();
  availableUserEventsProperties = input.required<UserEventProperties[]>();

  removeAttributeGroup = output<void>();

  attributeInput = signal<string>('');
  showCompareControls = signal<boolean>(false);
  isCompareFunctionComplex = signal<boolean>(false);

  filteredEventProperties = computed(() => {
    const attributeInput = this.attributeInput();

    const availableUserEventsProperties =
      this.availableUserEventsProperties().filter(
        (prop) =>
          !this.alreadyAssignedAttributes().includes(prop.property) ||
          prop.property === attributeInput
      );

    if (!attributeInput) {
      return availableUserEventsProperties;
    }

    return availableUserEventsProperties.filter((prop) =>
      prop.property.includes(attributeInput.toLowerCase())
    );
  });

  selectedAttributeType = computed(() => {
    const selectedAttribute = this.conditionGroup().get('attribute')?.value;
    const attributeConfig = this.filteredEventProperties().find(
      (prop) => prop.property === selectedAttribute
    );

    return attributeConfig?.type ?? 'string';
  });

  availableAttributeOperators = computed(() => {
    const selectedAttributeType = this.selectedAttributeType();

    return availableOperators.filter((fn) => fn.type === selectedAttributeType);
  });

  operandValueType = computed(() => {
    const attributeCompareFunctions = this.availableAttributeOperators();
    if (!attributeCompareFunctions || attributeCompareFunctions.length === 0) {
      return 'text';
    }

    const operandType = attributeCompareFunctions[0].type;
    return operandType === 'number' ? 'number' : 'text';
  });

  ngOnInit(): void {
    const currentFormGroup = this.conditionGroup();

    currentFormGroup
      .get('attribute')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.attributeInput.set(value);
        this.addCompareFunctionHandler(value);
      });

    if (currentFormGroup.get('attribute')?.value) {
      this.eventAttributeSelected(currentFormGroup.get('attribute')?.value);
    }

    const compareFunctionControl = currentFormGroup.get('operator');
    if (compareFunctionControl) {
      this.addCompareFunctionWatcher(compareFunctionControl);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  eventAttributeSelected(value: string) {
    // We can't use requireSelection on mat-autocomplete in combination with filter.
    // requireSelection would force model update only on selection so typing wouldn't trigger filter.
    this.conditionGroup().get('attribute')?.patchValue(value);

    // Do not show add condition button until event is selected
    this.showCompareControls.set(true);
  }

  clearEvent() {
    const attributeControl = this.conditionGroup().get('attribute');
    const eventTypeInputValue = attributeControl?.value;
    if (
      !this.availableUserEventsProperties()
        .map((event) => event.property)
        .includes(eventTypeInputValue)
    ) {
      attributeControl?.setValue('');
      this.showCompareControls.set(false);
    }
  }

  removeAttributeCondition() {
    this.removeAttributeGroup.emit();
  }

  private addCompareFunctionHandler(value: string) {
    if (value) {
      const currentFormGroup = this.conditionGroup();
      if (!currentFormGroup.contains('operator')) {
        const compareFnControl = this.formBuilder.control('');
        this.addCompareFunctionWatcher(compareFnControl);

        currentFormGroup.addControl('operator', compareFnControl);
        currentFormGroup.addControl('operand', this.formBuilder.control(''));
      }
    }
  }

  private addCompareFunctionWatcher(compareFunctionControl: AbstractControl) {
    const currentFormGroup = this.conditionGroup();

    compareFunctionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((compareFn) => {
        if (compareFn === 'between') {
          this.isCompareFunctionComplex.set(true);
          if (!currentFormGroup.contains('operand2')) {
            currentFormGroup.addControl(
              'operand2',
              this.formBuilder.control('')
            );
          }
        } else {
          this.isCompareFunctionComplex.set(false);
          currentFormGroup.removeControl('operand2');
        }
      });
  }
}
