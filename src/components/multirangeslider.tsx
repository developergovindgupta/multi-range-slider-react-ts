import React, { forwardRef, useEffect, useRef, useState } from 'react';
import './multirangeslider.css';
import './multirangesliderblack.css';

type Props = {
	id?: string;
	min?: number | string;
	max?: number | string;
	step?: number | string;
	minValue?: number | string;
	maxValue?: number | string;
	baseClassName?: string;
	className?: string;
	disabled?: boolean;
	style?: React.CSSProperties;
	ruler?: boolean | string;
	label?: boolean | string;
	subSteps?: boolean | string;
	stepOnly?: boolean | string;
	preventWheel?: boolean | string;
	labels?: string[];
	minCaption?: string;
	maxCaption?: string;
	barLeftColor?: string;
	barRightColor?: string;
	barInnerColor?: string;
	thumbLeftColor?: string;
	thumbRightColor?: string;
	onInput?: (e: ChangeResult) => void;
	onChange?: (e: ChangeResult) => void;
};
export type ChangeResult = {
	min: number;
	max: number;
	minValue: number;
	maxValue: number;
};
let _wheelTimeout: number | null = null;
let _triggerTimeout: number | null = null;
const MultiRangeSlider = (props: Props, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => {
	let ruler = props.ruler === undefined || props.ruler === null ? true : props.ruler;
	let label = props.label === undefined || props.label === null ? true : props.label;
	let subSteps = props.subSteps === undefined || props.subSteps === null ? false : props.subSteps;
	let stepOnly = props.stepOnly === undefined || props.stepOnly === null ? false : props.stepOnly;
	let preventWheel = props.preventWheel === undefined || props.preventWheel === null ? false : props.preventWheel;
	let refBar = useRef<HTMLDivElement>(null);
	let min = +(props.min || 0);
	let max = +(props.max || 100);
	let step = Math.abs(+(props.step || 5));
	let fixed = 0;
	let disabled = !!props.disabled;

	let stepCount = Math.floor((+max - +min) / +step);
	let labels: string[] = props.labels || [];
	if (labels.length === 0) {
		labels = [];
		labels.push(min.toString());
		labels.push(max.toString());
	} else {
		stepCount = labels.length - 1;
	}

	if (typeof label === 'string') {
		label = label === 'true';
	}
	if (typeof ruler === 'string') {
		ruler = ruler === 'true';
	}
	if (typeof preventWheel === 'string') {
		preventWheel = preventWheel === 'true';
	}
	if (step.toString().includes('.')) {
		fixed = 2;
	}
	let _minValue = props.minValue;
	if (_minValue === null || _minValue === undefined) {
		_minValue = 25;
	}
	_minValue = +_minValue;
	let _maxValue = props.maxValue;
	if (_maxValue === null || _maxValue === undefined) {
		_maxValue = 75;
	}
	_maxValue = +_maxValue;

	if (_minValue < min) {
		_minValue = min;
	}
	if (_minValue > max) {
		_minValue = max;
	}
	if (_maxValue < _minValue) {
		_maxValue = +_minValue + +step;
	}
	if (_maxValue > max) {
		_maxValue = max;
	}
	if (_maxValue < min) {
		_maxValue = min;
	}

	const [minValue, set_minValue] = useState(+_minValue);
	const [maxValue, set_maxValue] = useState(+_maxValue);
	const [barMin, set_barMin] = useState(((minValue - min) / (max - min)) * 100);
	const [barMax, set_barMax] = useState(((max - maxValue) / (max - min)) * 100);
	const [minCaption, setMinCaption] = useState<string>('');
	const [maxCaption, setMaxCaption] = useState<string>('');
	const [isChange, setIsChange] = useState(true);

	const onBarLeftClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _minValue = minValue - step;
		if (_minValue < min) {
			_minValue = min;
		}
		set_minValue(_minValue);
	};
	const onInputMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		let _minValue = parseFloat(e.target.value);
		if (_minValue > maxValue - step) {
			_minValue = maxValue - step;
		}
		set_minValue(_minValue);
		setIsChange(true);
	};
	const onLeftThumbMousedown: React.MouseEventHandler = (e: React.MouseEvent) => {
		if (disabled) return;
		let startX = e.clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = minValue;
		setIsChange(false);
		let onLeftThumbMousemove: { (e: MouseEvent): void } = (e: MouseEvent) => {
			let clientX = e.clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < min) {
				val = min;
			} else if (val > maxValue - step) {
				val = maxValue - step;
			}
			set_minValue(val);
		};
		let onLeftThumbMouseup: { (e: MouseEvent): void } = (e: MouseEvent) => {
			setIsChange(true);
			document.removeEventListener('mousemove', onLeftThumbMousemove);
			document.removeEventListener('mouseup', onLeftThumbMouseup);
		};
		document.addEventListener('mousemove', onLeftThumbMousemove);
		document.addEventListener('mouseup', onLeftThumbMouseup);
	};
	const onLeftThumbTouchStart = (e: React.TouchEvent) => {
		if (disabled) return;
		let startX = e.touches[0].clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = minValue;
		setIsChange(false);
		let onLeftThumbToucheMove: { (e: TouchEvent): void } = (e: TouchEvent) => {
			let clientX = e.touches[0].clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < min) {
				val = min;
			} else if (val > maxValue - step) {
				val = maxValue - step;
			}
			set_minValue(val);
		};
		let onLeftThumbTouchEnd: { (e: TouchEvent): void } = (e: TouchEvent) => {
			setIsChange(true);
			document.removeEventListener('touchmove', onLeftThumbToucheMove);
			document.removeEventListener('touchend', onLeftThumbTouchEnd);
		};

		document.addEventListener('touchmove', onLeftThumbToucheMove);
		document.addEventListener('touchend', onLeftThumbTouchEnd);
	};
	const onInnerBarLeftClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _minValue = minValue + step;
		if (_minValue > maxValue - step) {
			_minValue = maxValue - step;
		}
		set_minValue(_minValue);
	};
	const onInnerBarRightClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _maxValue = maxValue - step;
		if (_maxValue < minValue + step) {
			_maxValue = minValue + step;
		}
		set_maxValue(_maxValue);
	};
	const onInputMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		let _maxValue = parseFloat(e.target.value);
		if (_maxValue < minValue + step) {
			_maxValue = minValue + step;
		}
		set_maxValue(_maxValue);
		setIsChange(true);
	};
	const onRightThumbMousedown: React.MouseEventHandler = (e: React.MouseEvent) => {
		if (disabled) return;
		let startX = e.clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = maxValue;
		setIsChange(false);
		let onRightThumbMousemove: { (e: MouseEvent): void } = (e: MouseEvent) => {
			let clientX = e.clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < minValue + step) {
				val = minValue + step;
			} else if (val > max) {
				val = max;
			}
			set_maxValue(val);
		};
		let onRightThumbMouseup: { (e: MouseEvent): void } = (e: MouseEvent) => {
			setIsChange(true);
			document.removeEventListener('mousemove', onRightThumbMousemove);
			document.removeEventListener('mouseup', onRightThumbMouseup);
		};
		document.addEventListener('mousemove', onRightThumbMousemove);
		document.addEventListener('mouseup', onRightThumbMouseup);
	};
	const onRightThumbTouchStart = (e: React.TouchEvent) => {
		if (disabled) return;
		let startX = e.touches[0].clientX;
		let thumb = e.target as HTMLDivElement;
		let bar = thumb.parentNode as HTMLDivElement;
		let barBox = bar.getBoundingClientRect();
		let barValue = maxValue;
		setIsChange(false);
		let onRightThumbTouchMove: { (e: TouchEvent): void } = (e: TouchEvent) => {
			let clientX = e.touches[0].clientX;
			let dx = clientX - startX;
			let per = dx / barBox.width;
			let val = barValue + (max - min) * per;
			if (stepOnly) {
				val = Math.round(val / step) * step;
			}
			val = parseFloat(val.toFixed(fixed));
			if (val < minValue + step) {
				val = minValue + step;
			} else if (val > max) {
				val = max;
			}
			set_maxValue(val);
		};
		let onRightThumbTouchEnd: { (e: TouchEvent): void } = (e: TouchEvent) => {
			setIsChange(true);
			document.removeEventListener('touchmove', onRightThumbTouchMove);
			document.removeEventListener('touchend', onRightThumbTouchEnd);
		};
		document.addEventListener('touchmove', onRightThumbTouchMove);
		document.addEventListener('touchend', onRightThumbTouchEnd);
	};
	const onBarRightClick = (e: React.MouseEvent) => {
		if (disabled) return;
		let _maxValue = maxValue + step;
		if (_maxValue > max) {
			_maxValue = max;
		}
		set_maxValue(_maxValue);
	};
	const onMouseWheel = (e: React.WheelEvent) => {
		if (disabled) return;
		if (preventWheel === true) {
			return;
		}
		if (!e.shiftKey && !e.ctrlKey) {
			return;
		}
		let val = (max - min) / 100;
		if (val > 1) {
			val = 1;
		}
		if (e.deltaY < 0) {
			val = -val;
		}

		let _minValue = minValue;
		let _maxValue = maxValue;
		if (e.shiftKey && e.ctrlKey) {
			if (_minValue + val >= min && _maxValue + val <= max) {
				_minValue = _minValue + val;
				_maxValue = _maxValue + val;
			}
		} else if (e.ctrlKey) {
			val = _maxValue + val;
			if (val < _minValue + step) {
				val = _minValue + step;
			} else if (val > max) {
				val = max;
			}
			_maxValue = val;
		} else if (e.shiftKey) {
			val = _minValue + val;
			if (val < min) {
				val = min;
			} else if (val > _maxValue - step) {
				val = _maxValue - step;
			}
			_minValue = val;
		}
		setIsChange(false);
		set_maxValue(_maxValue);
		set_minValue(_minValue);
		_wheelTimeout && window.clearTimeout(_wheelTimeout);
		_wheelTimeout = window.setTimeout(() => {
			setIsChange(true);
		}, 100);
	};
	useEffect(() => {
		if (refBar && refBar.current) {
			let bar = refBar.current as HTMLDivElement;
			let p_bar = bar.parentNode as HTMLDivElement;
			p_bar.addEventListener('wheel', (e) => {
				if (!e.shiftKey && !e.ctrlKey) {
					return;
				}
				e.preventDefault();
			});
		}
	}, [refBar]);

	useEffect(() => {
		if (maxValue < minValue) {
			throw new Error('maxValue is less than minValue');
		}
		const triggerChange = () => {
			let result: ChangeResult = { min, max, minValue, maxValue };
			isChange && props.onChange && props.onChange(result);
			props.onInput && props.onInput(result);
		};
		setMinCaption(props.minCaption || minValue.toFixed(fixed));
		setMaxCaption(props.maxCaption || maxValue.toFixed(fixed));
		let _barMin = ((minValue - min) / (max - min)) * 100;
		set_barMin(_barMin);
		let _barMax = ((max - maxValue) / (max - min)) * 100;
		set_barMax(_barMax);
		_triggerTimeout && window.clearTimeout(_triggerTimeout);
		_triggerTimeout = window.setTimeout(triggerChange, 20);
	}, [minValue, maxValue, min, max, fixed, props, isChange]);

	useEffect(() => {
		let _minValue = props.minValue;
		if (_minValue === null || _minValue === undefined) {
			_minValue = 25;
		}
		_minValue = +_minValue;
		if (_minValue < min) {
			_minValue = min;
		}
		if (_minValue > max) {
			_minValue = max;
		}
		setIsChange(false);
		set_minValue(+_minValue);
	}, [props.minValue, min, max]);
	useEffect(() => {
		let _maxValue = props.maxValue;
		if (_maxValue === null || _maxValue === undefined) {
			_maxValue = 75;
		}
		_maxValue = +_maxValue;

		if (_maxValue > max) {
			_maxValue = max;
		}
		if (_maxValue < min) {
			_maxValue = min;
		}
		setIsChange(false);
		set_maxValue(+_maxValue);
	}, [props.maxValue, min, max, step]);

	return (
		<div ref={ref} id={props.id} className={(props.baseClassName || 'multi-range-slider') + ' ' + (props.className || '') + (disabled ? ' disabled' : '')} style={props.style} onWheel={onMouseWheel} >
			<div className='bar' ref={refBar}>
				<div className='bar-left' style={{ width: barMin + '%', backgroundColor: props.barLeftColor }} onClick={onBarLeftClick}></div>
				<input placeholder='min-value' className='input-type-range input-type-range-min' type='range' min={min} max={max} step={step} value={minValue} onInput={onInputMinChange} />
				<div className='thumb thumb-left' style={{ backgroundColor: props.thumbLeftColor }} onMouseDown={onLeftThumbMousedown} onTouchStart={onLeftThumbTouchStart}>
					<div className='caption'>
						<span className='min-caption'>{minCaption}</span>
					</div>
				</div>
				<div className='bar-inner' style={{ backgroundColor: props.barInnerColor }}>
					<div className='bar-inner-left' onClick={onInnerBarLeftClick}></div>
					<div className='bar-inner-right' onClick={onInnerBarRightClick}></div>
				</div>
				<input placeholder='max-value' className='input-type-range input-type-range-max' type='range' min={min} max={max} step={step} value={maxValue} onInput={onInputMaxChange} />
				<div className='thumb thumb-right' style={{ backgroundColor: props.thumbRightColor }} onMouseDown={onRightThumbMousedown} onTouchStart={onRightThumbTouchStart}>
					<div className='caption'>
						<span className='max-caption'>{maxCaption}</span>
					</div>
				</div>
				<div className='bar-right' style={{ width: barMax + '%', backgroundColor: props.barRightColor }} onClick={onBarRightClick}></div>
			</div>
			{ruler && (
				<div className='ruler'>
					{[...Array(stepCount)].map((e, i) => (
						<div key={i} className='ruler-rule'>
							{subSteps && [...Array(10)].map((e, n) => <div key={n} className='ruler-sub-rule'></div>)}
						</div>
					))}
				</div>
			)}
			{label && (
				<div className='labels'>
					{labels.map((label) => {
						return (
							<div key={label.toString()} className='label'>
								{label}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default React.memo(forwardRef<HTMLDivElement, Props>(MultiRangeSlider));
