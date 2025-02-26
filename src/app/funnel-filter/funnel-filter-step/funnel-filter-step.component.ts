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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CustomerEventFilterService } from '../services/customer-event-filter.service';
import { FunnelFilterStepConditionComponent } from '../funnel-filter-step-condition/funnel-filter-step-condition.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-funnel-filter-step',
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FunnelFilterStepConditionComponent,
  ],
  templateUrl: './funnel-filter-step.component.html',
  styleUrl: './funnel-filter-step.component.scss',
})
export class FunnelFilterStepComponent implements OnDestroy, OnInit {
  eventFilterService = inject(CustomerEventFilterService);
  formBuilder = inject(FormBuilder);

  private destroy$ = new Subject<void>();

  stepForm = input.required<FormGroup>();
  stepIndex = input.required<number>();

  onStepDelete = output<void>();
  onStepCopy = output<void>();

  alreadyAssignedEventAttributes = signal<string[]>([]);
  eventTypeInput = signal<string>('');
  allowAddConditionButton = signal<boolean>(false);

  stepFormOrder = computed(() => this.stepForm().value?.order ?? 0);

  stepFormName = computed(() => this.stepForm().value?.name);

  getAvailableEventAttributes = computed(() => {
    const selectedEvent = this.availableUserEvents().find(
      (event) => event.type === this.stepForm().value['eventType']
    );

    return selectedEvent ? selectedEvent.properties : [];
  });

  filteredEventsByInput = computed(() => {
    const selectedEventType = this.eventTypeInput();

    const eventsTypes = this.availableUserEvents().map((event) => event.type);
    if (!selectedEventType) {
      return eventsTypes;
    }

    return eventsTypes.filter((event) =>
      event.includes(selectedEventType.toLowerCase())
    );
  });

  get conditions() {
    return this.stepForm().get('conditions') as FormArray<FormGroup>;
  }

  get availableUserEvents() {
    return this.eventFilterService.userEvents;
  }

  ngOnInit(): void {
    if (this.conditions) {
      this.setAlreadyAssignedAttributes(this.conditions.value);
      this.setupAlreadyAssignedAttributeWatcher(this.conditions);
    }

    this.stepForm()
      .get('eventType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.eventTypeInput.set(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  eventSelected(event: MatAutocompleteSelectedEvent) {
    // We can't use requireSelection on mat-autocomplete in combination with filter.
    // requireSelection would force model update only on selection so typing wouldn't trigger filter.
    this.stepForm().get('eventType')?.setValue(event.option.value);

    // Do not show add condition button until event is selected
    this.allowAddConditionButton.set(true);
  }

  clearEvent() {
    const eventTypeControl = this.stepForm().get('eventType');
    const eventTypeInputValue = eventTypeControl?.value;
    if (
      !this.availableUserEvents()
        .map((event) => event.type)
        .includes(eventTypeInputValue)
    ) {
      eventTypeControl?.setValue('');
      this.allowAddConditionButton.set(false);
    }
  }

  addEventCondition() {
    const attributeGroup = this.formBuilder.group({
      attribute: this.formBuilder.control(''),
    });

    if (this.stepForm().contains('conditions')) {
      this.conditions.push(attributeGroup);
    } else {
      const conditionsArray = this.formBuilder.array([attributeGroup]);
      this.stepForm().addControl('conditions', conditionsArray);
      this.setupAlreadyAssignedAttributeWatcher(conditionsArray);
    }
  }

  copyStep() {
    this.onStepCopy.emit();
  }

  deleteStep() {
    this.onStepDelete.emit();
  }

  editStepName() {}

  private setupAlreadyAssignedAttributeWatcher(conditionsArray: FormArray) {
    conditionsArray.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.setAlreadyAssignedAttributes(value);
      });
  }

  private setAlreadyAssignedAttributes(
    conditionsArray: { attribute: string }[]
  ) {
    this.alreadyAssignedEventAttributes.set(
      conditionsArray.map(
        (conditionGroup: { attribute: string }) =>
          conditionGroup.attribute ?? ''
      )
    );
  }
}
