# import dependencies
import os
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify

from sqlalchemy import Column, Integer, String, Float

#################################################
# Database Setup
#################################################

database_path = "sqlite:///project2.sqlite"
engine = create_engine(database_path)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
# crime_table = Base.classes.crime_table
# household_table = Base.classes.household_table
# nonemp = Base.classes.nonemp
# poverty_table = Base.classes.poverty_table
# state_table = Base.classes.state_table

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available data:<br/>"
        f"<a href='final_merged_raw_data.json'>final_merged_raw_data.json</a><br/>" 
        #f"<a href='group_by_poverty_nonemp_results.json'>group_by_poverty_nonemp_results.json</a><br/>"
        #f"<a href='all_calculation.json'>all_calculation.json</a><br/>" 
    )


@app.route("/final_merged_raw_data.json/")
def merged_data():
    # Return final_merged_raw_data
    session = Session(engine)

    """Return a list of all final_merged_raw_data"""
    # Query all merged_data

    merged_updated_results = [record for record in session.execute(f"""
                  SELECT 
                     state_table.state_code,
                     state_table.percent_hs_grad,
                     state_table.per_capita_income,
                     crime_table.homicide_rate,
                     crime_table.firearms_death_rate,
                     crime_table.total_firearm_deaths,
                     household_table.household_size,
                     household_table.median_income,
                     poverty_table.sixteen_average,
                     poverty_table.sixteen_error,
                     poverty_table.fifteen_average,
                     poverty_table.fifteen_error,
                     poverty_table.seventeen_average,
                     poverty_table.seventeen_error,
                     poverty_table.three_year_error,
                     nonemp.county,
                     nonemp.NRCPTOT
                                                       
                FROM state_table                                   
                left join crime_table
                    on crime_table.state_code = state_table.state_code
                left join household_table
                    on household_table.state_code = state_table.state_code
                left join poverty_table
                    on poverty_table.state_code = state_table.state_code
                left join nonemp
                    on nonemp.state_code = state_table.state_code
                ORDER BY state_table.state_code 
            """).fetchall()]
    session.close()

     # Convert list of tuples into normal list
    
    return_list = []
    for row in merged_updated_results:
        item = {
            'state_code': row.state_code,
            'percent_hs_grad': row.percent_hs_grad,
            'per_capita_income': row.per_capita_income,
            'homicide_rate': row.homicide_rate,
            'firearms_death_rate':row.firearms_death_rate,
            'total_firearm_deaths': row.total_firearm_deaths,
            'household_size':row.household_size,
            'median_income': row.median_income, 
            'sixteen_average': row.sixteen_average,
            'sixteen_error': row.sixteen_error,
            'fifteen_average': row.fifteen_average,
            'fifteen_error': row.fifteen_error,
            'seventeen_average': row.seventeen_average,
            'seventeen_error': row.seventeen_error,
            'three_year_error': row.three_year_error,
            'county': row.county,
            'NRCPTOT': row.NRCPTOT

        }
        return_list.append(item)

    return jsonify(return_list)


# @app.route("/all_calculation.json/")
# def calculation():
#     # Return all_calculation_results data
#     session = Session(engine)

#     """Return a list of all merged_data"""
#     # Query all all_calculation_results
#     all_calculation_results = [record for record in session.execute(f"""
#         SELECT
#            state_table.state_code,
#            min(state_table.percent_hs_grad) as min_percent_hs_grad,
#            min(state_table.per_capita_income) as min_per_capita_income,
#            min(crime_table.homicide_rate) as min_homicide_rate,
#            min(crime_table.firearms_death_rate) as min_firearms_death_rate,
#            min(crime_table.total_firearm_deaths) as min_total_firearm_deaths,
#            min(household_table.household_size) as min_household_size, 
#            min(household_table.median_income) as min_median_income,
#            max(household_table.median_income) as max_median_income,
#            avg(household_table.median_income) as avg_median_income,
#            min(poverty_table.sixteen_average) as min_sixteen_average, 
#            max(poverty_table.sixteen_error) as max_sixteen_error,
#            min(poverty_table.fifteen_average) as min_fifteen_average,
#            max(poverty_table.fifteen_error) as max_fifteen_error,
#            min(poverty_table.seventeen_average) as min_seventeen_average,
#            max(poverty_table.seventeen_error) as max_seventeen_error,
#            avg(poverty_table.three_year_error) as avg_three_year_error,
#            avg(nonemp.county) as avg_county,
#            min(nonemp.NRCPTOT) as min_NRCPTOT
                                                       
#         FROM state_table
#         left join crime_table
#            on crime_table.state_code = state_table.state_code
#         left join household_table
#            on household_table.state_code = state_table.state_code
#         left join poverty_table
#            on poverty_table.state_code = state_table.state_code
#         left join nonemp
#            on nonemp.state_code = state_table.state_code
#         GROUP BY state_table.state_code
                                                     
#         """).fetchall()][0]

#     for row in all_calculation_results:
#         item = {
#             'state_code': row.state_code,
#             'min_percent_hs_grad': row.min_percent_hs_grad,
#             'min_per_capita_income': row.min_per_capita_income,
#             'min_homicide_rate': row.min_homicide_rate,
#             'min_firearms_death_rate': row.min_firearms_death_rate,
#             'min_total_firearm_deaths':row.min_total_firearm_deaths,
#             'min_household_size': row.min_household_size,
#             'min_median_income': row.min_median_income,
#             'max_median_income': row.max_median_income,
#             'avg_median_income': row.avg_median_income,
#             'min_sixteen_average': row.min_sixteen_average,
#             'max_sixteen_error': row.max_sixteen_error,
#             'min_fifteen_average': row.min_fifteen_average,
#             'max_fifteen_error': row.max_fifteen_error,
#             'min_seventeen_average': row.min_seventeen_average,
#             'max_seventeen_error': row.max_seventeen_error,
#             'avg_three_year_error': row.avg_three_year_error,
#             'avg_county': row.avg_county,
#             'min_NRCPTOT': row.min_NRCPTOT

#         }
#         # rounding
#         for key, value in item.items():
#             item[key] = round(value, 2)

#         return jsonify(item)
    
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
                            
