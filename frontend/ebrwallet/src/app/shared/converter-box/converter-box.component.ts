import {Component, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';

/**
 * Example Usage for using the converter box
 * <app-converter-box
 *     [baseImage]='"assets/img/Ethereum.png"'
 *     [bid]='ethusd.value'
 *     baseName='eth'
 *     quoteName='usd'
 *     (on_change)="handleConvertedData($event)"
 *     ></app-converter-box>
 */
@Component({
  selector: 'app-converter-box',
  templateUrl: './converter-box.component.html',
  styleUrls: ['./converter-box.component.css']
})
export class ConverterBoxComponent implements OnInit, OnChanges {

  @Input() baseName: string;
  @Input() quoteName: string;

  @Input() baseImage: string;
  @Input() quoteImage: string;

  @Input() bid: string;

  @Output() on_change: EventEmitter<object> = new EventEmitter();

  @Input() baseValue: string;
  quoteValue: string;

  constructor() {
  }

  ngOnInit() {
    if (!this.baseValue) {
      this.baseValue = '0';
    }
    const quote_value = parseFloat(this.baseValue) * parseFloat(this.bid);
    this.quoteValue = quote_value.toString();
  }

  toCap(value) {
    return value.toUpperCase();
  }

  baseToQuote(evt) {
    const base_value = parseFloat(evt.target.value);
    if (base_value !== 0 && evt.target.value.length > base_value.toString().length) {
      evt.target.value = base_value;
    }

    if (!base_value) {
      this.baseValue = '0';
      this.quoteValue = '0';
    }
    if (base_value && !isNaN(base_value) && base_value >= 0) {
      const quote_value = base_value * parseFloat(this.bid);
      this.quoteValue = quote_value.toString();
    }
    this.emit_change();
  }

  quoteToBase(evt) {
    const quote_value = parseFloat(evt.target.value);
    if (quote_value !== 0 && evt.target.value.length > quote_value.toString().length) {
      evt.target.value = quote_value;
    } else {
      this.baseValue = "0";
    }

    if (quote_value && !isNaN(quote_value) && quote_value >= 0) {
      const base_value = quote_value / parseFloat(this.bid);
      this.baseValue = base_value.toString();
    }
    this.emit_change();
  }

  ngOnChanges() {
    if (this.bid == "0")
      this.quoteValue = "0";
    this.baseValue = "0 "
  }

  // Emits converted data to the parent component
  emit_change() {
    this.on_change.emit({baseValue: this.baseValue, quoteValue: this.quoteValue})
  }
}
