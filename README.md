# README
This application displays a one page report (dashboard) that contains both a line-graph and a map of the 50 states.
These components visualize a travel dataset. The dataset is an aggregate of national travel from each state, by day.
This report includes 3 filters to customize the analysis:
1. Origin State
2. Date Range
3. Period

## Getting Started
Everything you'll need to get started running this project
locally is contained within a rails app.

Open up a terminal window, navigate to the directory, which
defaults to `arrivalist-challenge`, and type the following
commands;

```
$ rails db:setup 
$ yarn
$ rails s
```

Click this link [http://localhost:8080](http://localhost:8080)

## Features

Four filter controls interact with the Line Chart and the Map Chart as follows:

__Origin State__
This controls Which states data is presented on the Line Chart. It also highlights the state on the Map Chart.

__Start and End Date__
The start and end date selections control the range of data visualized on the  Line Chart and the Map Chart.

__Period__
There are four choices;
* __Using Date Selectors__ - Defaults on startup, as is switched to when using the start and end date controls, a convenient reminder.
* __2019__- Selects one year of data
* __2020__ - Selects one year of data
* __2019 vs 2020__ - creates two lines on the line chart (Currently Non-Functional. So for now, when you use it, it sets you back to initial full range of all data.

### Line Chart
The x-axis is days; the y-axis is trip_count for that day.

### Map Chart
Based on the date range showing, you'll see a large number; this is the Sum of all the `trip_count`'s. Hovering over any state shows the States name and the average and sum of  `trip_count`'s. (Currently Non-Functional.)

## Setback

Moving the React code to Rails ended up being a significant undertaking from a project dependency and time spent point of view.
It had the unforeseen consequence of regressing some of the features.

Rails projects are pre-loaded with several packages—some caused dependency issues and could, in a reasonable time,  be resolved, others not so much.

There was a fair amount of refactoring, but I chose to update the app based on  the dependencies that had only minor code
changes, anything that was of any consequence contributed to the loss of features, as I prioritized getting this turned in..

These are the casualties;
1. Unit Test
2. Zooming on the Line Chart
3. Tooltips on the Line Chart
4. Tooltips on the Map Chart
5. Multiple lines on the Line Chart

Another consequence was not spending time on scheduled features in our backlog.  These are the features I believe would have been completed otherwise;

1. Legends
2. State coordinated with circles
3. Selecting multiple states
4. Responsive behaviour
5. Theme switching

### Remaining Effort
Another consequence was the time I would have spent finishing features while doing the
rails migration;
* [ ]  Annotations
* [ ] Legend: Year
* [ ] State coordinated with circles
* [ ] Nice to have
  * [ ] Selecting multiple states
  * [ ] Theme Switching

* [ ] Known Issues
  * [ ] Zoom data points get all wonky when zooming in.
  * [ ] Tooltips for circles online chart
    * [ ] Single Year: Date & Trip count
    * [ ] Multi Year: Date & Trip count of both years and the difference between the two
  * [ ] MapChart tooltips

### TODO
* [ ] Functionality
  * [ ] Line Chart:
    * [ ] Fix Two year comparisons regression
      * [ ] Only have 12 months at a time while Periods is set to "2019 vs 2020"
    * [x] Change the range based on date range selection
    * [x] Implement start and stop date
    * [x] Y-Axis Trip Count Tick Marks
    * [x] Start and Stop date switch to MM/DD while set to "2019 vs 2020"
    * [x] X-axis needs to be lower about 15px
  * [x] Start and End Date
    * [x] LineChart
    * [x] MapChart In Model
      * [x] Sum of trip_count over the range selected. Library if > an amount will give me 4.2K
      * [x] Average trip_count over the range selected
  * [ ] Annotations
    * [ ] Legend: Year
  * [x] Filters:
    * [x] Equal spacing
    * [x] Low Bar: Keep them on the dashboard
    * [x] Clamp start and stop date to existing date
  * [x] Map Chart
    * [x] From and To date: US Map values are based on a summation of trip_counts for each state
  * [x] Move React code to Ruby on Rails project
    * [x] Get working via a simple tutorial
    * [x] Get Material-UI Beer
    * [x] Port code over from FE to BE
  * [x] Bugs
    * [x] Changing state throws error
    * [x] Size of LineChart is too small
    * [x] MapChart Data is in error


