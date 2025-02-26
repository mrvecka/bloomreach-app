import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { FunnelFilterStepComponent } from './funnel-filter-step/funnel-filter-step.component';

type ConditionFormGroup = Partial<{
  attribute: string;
  operator: string;
  operand: string;
  operand2: string;
}>;

@Component({
  selector: 'app-funnel-filter',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    FunnelFilterStepComponent,
  ],
  templateUrl: './funnel-filter.component.html',
  styleUrl: './funnel-filter.component.scss',
})
export class FunnelFilterComponent {
  private formBuilder = inject(FormBuilder);

  customerFilter = this.getFilterForm();

  get stepsFormArray() {
    return this.customerFilter.get('steps') as FormArray<FormGroup>;
  }

  applyFilter() {
    console.log(this.customerFilter.value);
  }

  discardFilter() {
    this.customerFilter = this.getFilterForm();
  }

  addFilterStep() {
    this.stepsFormArray.push(this.getStepForm(this.stepsFormArray.length + 1));
  }

  deleteStep(index: number) {
    this.stepsFormArray.removeAt(index);
  }

  copyStep(index: number) {
    const newConditionGroup = this.getStepForm(this.stepsFormArray.length + 1);

    const stepToCopy = this.stepsFormArray.at(index).value;
    if (stepToCopy.conditions) {
      const existingAttributes = stepToCopy.conditions.map(
        (conditionGroup: ConditionFormGroup) => {
          const attributeConditionGroup =
            this.createConditionFormGroupFromStep(conditionGroup);

          return attributeConditionGroup;
        }
      );

      newConditionGroup.addControl<any>(
        'conditions',
        this.formBuilder.array([...existingAttributes])
      );
    }

    this.stepsFormArray.push(newConditionGroup);

    newConditionGroup.patchValue({
      ...stepToCopy,
      order: this.stepsFormArray.value.length,
      name: 'Unnamed Step',
    });
  }

  private getStepForm(index: number) {
    return this.formBuilder.group({
      order: this.formBuilder.control(index),
      eventType: this.formBuilder.control(''),
      name: this.formBuilder.control('Unnamed Step'),
    });
  }

  private getFilterForm() {
    return this.formBuilder.group({
      steps: this.formBuilder.array([this.getStepForm(1)]),
    });
  }

  private createConditionFormGroupFromStep(conditionGroup: ConditionFormGroup) {
    const attributeGroup = this.formBuilder.group<any>({
      attribute: this.formBuilder.control(conditionGroup.attribute),
    });

    if ('operator' in conditionGroup) {
      attributeGroup.addControl(
        'operator',
        this.formBuilder.control(conditionGroup.operator)
      );
    }

    if ('operand' in conditionGroup) {
      attributeGroup.addControl(
        'operand',
        this.formBuilder.control(conditionGroup.operand)
      );
    }

    if ('operand2' in conditionGroup) {
      attributeGroup.addControl(
        'operand2',
        this.formBuilder.control(conditionGroup.operand2)
      );
    }

    return attributeGroup;
  }
}
