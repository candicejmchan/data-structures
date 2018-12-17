# Tilt Sensor

The tilt sensor tracks tilts of the trash can over a span of one month. The analogue variable returns values of either 0 to represent no tilt or 1 to represent existence of tilt.


## Usage
The code groups data by day and prints the total number of observations(count) per day, then calculates the number of tilts or garbage thrown out would occur if that number is multipled for a week, a month, and a year.

    One day's worth of tilts converted to day, week, month, and year:
    const data = {
              day: d.sensorday,
              num_obs: +d.tilted,
              average: formatPercent(d.average),
              week: 7 * +d.tilted,
              month: 30 * +d.tilted,
              year: 365 * +d.tilted
          };


            The number of times the sensor was tilted:
            const tilted = _.filter(d[1], k => +k.value === 1)[0];
            temp.tilted = tilted ? +tilted.num_obs : 0;


            The number of times the sensor was not tilted:  
            const closed = _.filter(d[1], k => +k.value === 0)[0];
            temp.closed = closed ? +closed.num_obs : 0;            

            The average of tilted to not tilted:
            temp.average = temp.tilted / temp.total_obs;
            return temp;


# AA Meeting

This project shows all AA meetings in New York City and displays the location, address, start time, end time, meeting type, meeting details, and whether or not wheelchair access is present.  

# Dear Diary
Dear Diary is a collection of data from October 14th to November 2nd. It shows my breakfast, lunch, and dinner for those select days and the dominant tastes for each of those meals. The tastes include: sweet, salty, bitter, spicy, and sour.
The idea of the circle is to show the time of day that I usually eat those meals and the aggregate totals for each of those tastes.  

Data is in FinalProjects/FinalProjects.js
chart public/js/diary_chart.js
css public/css/diary.css
