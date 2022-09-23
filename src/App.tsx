import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MultiRangeSlider, { ChangeResult } from './components/multirangeslider';

function App() {
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const ref = useRef<HTMLDivElement>(null);
	const [minValue, setMinValue] = useState(25);
	const [maxValue, setMaxValue] = useState(75);
	const [minValue2, setMinValue2] = useState(25);
	const [maxValue2, setMaxValue2] = useState(75);
	const [minValue3, setMinValue3] = useState(0);
	const [maxValue3, setMaxValue3] = useState(6);
	const [minValue4, setMinValue4] = useState(0);
	const [maxValue4, setMaxValue4] = useState(0);
	const [minValue5, setMinValue5] = useState(0);
	const [maxValue5, setMaxValue5] = useState(0);
	const [minValue6, setMinValue6] = useState(0);
	const [maxValue6, setMaxValue6] = useState(0);
	useEffect(() => {
		let div = ref.current;
		console.log(div);
	}, []);
	const [minCaption, set_minCaption] = useState('');
	const [maxCaption, set_maxCaption] = useState('');

	//Date Range Selection methods/state/constants
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const yearDays = 365 + (new Date().getFullYear() % 4 === 0 ? 1 : 0);
	const [minMonthCaption, set_minMonthCaption] = useState('');
	const [maxMonthCaption, set_maxMonthCaption] = useState('');
	const [minMonthValue, setMinMonthValue] = useState(0);
	const [maxMonthValue, setMaxMonthValue] = useState(365);
	const formatDate = (date: Date): string => {
		let dateStr = '';
		let d = date.getDate();
		let m = date.getMonth();
		let y = date.getFullYear();
		let w = date.getDay();
		dateStr = weekDays[w] + ' ' + d + '-' + monthNames[m] + '-' + y;
		return dateStr;
	};
	const handleDateChange = (e: ChangeResult) => {
		let d = new Date();
		let dd1 = new Date(d.getFullYear(), 0, 1);
		let dd2 = new Date(d.getFullYear(), 0, 1);

		dd1.setDate(e.minValue + 1);
		dd2.setDate(e.maxValue + 1);

		set_minMonthCaption(formatDate(dd1));
		set_maxMonthCaption(formatDate(dd2));
		setMinMonthValue(e.minValue);
		setMaxMonthValue(e.maxValue);
	};

	//Time Range Selection methods/state/constants
	const curTime = new Date();
	const timeMax = 12 * 60 - 1;
	const curMin = (curTime.getHours() % 12) * 60 + curTime.getMinutes();
	const [minTimeCaption, set_minTimeCaption] = useState('');
	const [maxTimeCaption, set_maxTimeCaption] = useState('');
	const handleTimeChange = (e: ChangeResult) => {
		let h = Math.floor(e.minValue / 60);
		let m = e.minValue % 60;
		let minH = h.toString().padStart(2, '0');
		let minM = m.toString().padStart(2, '0');
		set_minTimeCaption(minH + ':' + minM);

		let hh = Math.floor(e.maxValue / 60);
		let mm = e.maxValue % 60;
		let maxH = hh.toString().padStart(2, '0');
		let maxM = mm.toString().padStart(2, '0');
		set_maxTimeCaption(maxH + ':' + maxM);
	};
	const getTimeLabels = (): string[] => {
		let arr: string[] = [];
		for (let i = 0; i <= 12; i++) {
			arr.push(i.toString().padStart(2, '0') + '.00');
		}
		return arr;
	};
	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
			</header>
			<div>
				<h1>multi-range-slider-react demo</h1>
			</div>
			<hr />
			<div className='multi-range-slider-container'>
				<b>Simple range slider with default values</b>
				<hr />
				<MultiRangeSlider
					ref={ref}
					onInput={(e: ChangeResult) => {
						setMinValue(e.minValue);
						setMaxValue(e.maxValue);
					}}
				></MultiRangeSlider>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onInput:</div>
					<div style={{ margin: '10px' }}>{minValue}</div>
					<div style={{ margin: '10px' }}>{maxValue}</div>
				</div>
			</div>
			<hr />
			<div className='multi-range-slider-container'>
				<b>Range slider with custom css</b>
				<hr />
				<div>baseClassName='multi-range-slider-black'</div>
				<div>minValue and maxValue dependent on state </div>
				<MultiRangeSlider
					baseClassName='multi-range-slider-black'
					minValue={minValue}
					maxValue={maxValue}
					onChange={(e: ChangeResult) => {
						setMinValue2(e.minValue);
						setMaxValue2(e.maxValue);
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onChange:</div>
					<div style={{ margin: '10px' }}>{minValue2}</div>
					<div style={{ margin: '10px' }}>{maxValue2}</div>
				</div>
			</div>
			<hr />
			<div className='multi-range-slider-container'>
				<b>Range slider for week days range</b>
				<hr />
				<div>labels = [{weekDays.join(', ')}] </div>
				<div>min = '0'</div>
				<div>max = '6'</div>
				<div>step = '1'</div>
				<MultiRangeSlider
					labels={weekDays}
					min='0'
					max='6'
					minValue='1'
					maxValue='5'
					step='1'
					minCaption={minCaption}
					maxCaption={maxCaption}
					onInput={(e: ChangeResult) => {
						set_minCaption(weekDays[e.minValue]);
						set_maxCaption(weekDays[e.maxValue]);
						setMinValue3(e.minValue);
						setMaxValue3(e.maxValue);
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onInput:</div>
					<div style={{ margin: '10px' }}>
						{minValue3}:{minCaption}
					</div>
					<div style={{ margin: '10px' }}>
						{maxValue3}:{maxCaption}
					</div>
				</div>
			</div>
			<hr />
			<div className='multi-range-slider-container'>
				<b>Range slider for date-range</b>
				<hr />
				<div>labels = [{monthNames.join(', ')}] </div>
				<div>min=0</div>
				<div>max=365</div>
				<div>step=1</div>
				<div>minCaption=string</div>
				<div>maxCaption=string</div>
				<MultiRangeSlider
					labels={monthNames}
					min={0}
					max={yearDays - 1}
					minValue={new Date().getDate()}
					maxValue={yearDays - 1}
					step={1}
					minCaption={minMonthCaption}
					maxCaption={maxMonthCaption}
					onInput={handleDateChange}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onInput:</div>
					<div style={{ margin: '10px' }}>
						{minMonthValue}:{minMonthCaption}
					</div>
					<div style={{ margin: '10px' }}>
						{maxMonthValue}:{maxMonthCaption}
					</div>
				</div>
			</div>
			<hr />
			<div className='multi-range-slider-container'>
				<b>Time-Range</b>
				<hr />
				<div>
					<span>labels=</span>
					<span style={{ fontSize: '14px' }}> [{getTimeLabels().join(', ')}] </span>
				</div>
				<div>min = {0}</div>
				<div>max = {timeMax}</div>
				<div>step = 1</div>
				<div>subSteps = true</div>
				<MultiRangeSlider
					labels={getTimeLabels()}
					min={0}
					max={timeMax}
					minValue={curMin}
					maxValue={timeMax}
					step={1}
					subSteps={true}
					minCaption={minTimeCaption}
					maxCaption={maxTimeCaption}
					onInput={handleTimeChange}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onInput:</div>
					<div style={{ margin: '10px' }}>{minTimeCaption}</div>
					<div style={{ margin: '10px' }}>{maxTimeCaption}</div>
				</div>
			</div>
			<hr />
			<div className='multi-range-slider-container'>
				<b>negative and positive range </b>
				<hr />
				<div>min={-1}</div>
				<div>max={1}</div>
				<div>minValue={-0.5}</div>
				<div>maxValue={0.5}</div>
				<div>step={0.1}</div>
				<MultiRangeSlider
					min={-1}
					max={1}
					minValue={-0.5}
					maxValue={0.5}
					step={0.1}
					onInput={(e) => {
						setMinValue4(e.minValue);
						setMaxValue4(e.maxValue);
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onInput:</div>
					<div style={{ margin: '10px' }}>{minValue4}</div>
					<div style={{ margin: '10px' }}>{maxValue4}</div>
				</div>
			</div>
			<hr />
			<div className='multi-range-slider-container'>
				<b>Range slider for range in round of steps</b>
				<hr />
				<div>min = 0</div>
				<div>max = 100</div>
				<div>step = 5</div>
				<div> stepOnly = true </div>
				<MultiRangeSlider
					min={0}
					max={100}
					minValue={30}
					maxValue={60}
					step={5}
					stepOnly={true}
					onInput={(e) => {
						setMinValue5(e.minValue);
						setMaxValue5(e.maxValue);
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onInput:</div>
					<div style={{ margin: '10px' }}>{minValue5}</div>
					<div style={{ margin: '10px' }}>{maxValue5}</div>
				</div>
			</div>
			<hr />
			<div className='multi-range-slider-container' style={{ border: 'solid 1px' }}>
				<h3> custom style </h3>
				<hr />
				<div>style=" border: 'none', boxShadow: 'none', padding: '15px 10px' "</div>
				<div>label='false'</div>
				<div>ruler='false'</div>
				<div>barLeftColor='red'</div>
				<div>barInnerColor='blue'</div>
				<div>barRightColor='green'</div>
				<div>thumbLeftColor='lime'</div>
				<div>thumbRightColor='lime'</div>
				<MultiRangeSlider
					min={0}
					max={100}
					onInput={(e) => {
						setMinValue6(e.minValue);
						setMaxValue6(e.maxValue);
					}}
					label={false}
					ruler={false}
					style={{ border: 'none', boxShadow: 'none', padding: '15px 10px' }}
					barLeftColor='red'
					barInnerColor='blue'
					barRightColor='green'
					thumbLeftColor='lime'
					thumbRightColor='lime'
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ margin: '10px' }}>onInput:</div>
					<div style={{ margin: '10px' }}>{minValue6}</div>
					<div style={{ margin: '10px' }}>{maxValue6}</div>
				</div>
			</div>
			<hr />
		</div>
	);
}

export default App;
