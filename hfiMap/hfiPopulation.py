import bs4 as bs
import urllib.request
import pandas as pd
pd.set_option('display.max_columns', 500)
pd.set_option('display.max_rows', 10000)
pd.set_option('display.width', 1000)

source = urllib.request.urlopen('https://www.geonames.org/countries/').read()
soup = bs.BeautifulSoup(source, 'lxml')
table = soup.find('table', id='countries')
table_rows = table.find_all('tr')

rows = []
for tr in table_rows:
    td = tr.find_all('td')
    row = [i.text for i in td]
    rows.append(row)

df = pd.DataFrame(rows, columns=['ISO2', 'ISO3', 'ISO3n', 'fips', 'country', 'capital', 'area', 'pop', 'continent'])
df = df.iloc[1:, :]

# keep columns to merge with datasets
merge_pop = df[['ISO2', 'ISO3', 'country']]

# read cities.csv
# error: https://stackoverflow.com/questions/18171739/unicodedecodeerror-when-reading-csv-file-in-pandas-with-python
cities = pd.read_csv('cities15000.csv', encoding='latin')
merge_cities = cities[['asciiname', 'latitude', 'longitude', 'country code', 'population']]

# read all_countries.csv
hfi = pd.read_csv('./../hfi_cc_2021.csv')
merge_hfi = hfi[['year', 'countries', 'ISO', 'hf_score', 'hf_quartile', 'pf_score', 'ef_score']]

# merge datasets
# left merge of merge_hfi + merge_pop
hfi_cities = merge_pop.merge(merge_hfi, how='left', left_on='ISO3', right_on='ISO')
# print(hfi_cities.head())
# left merge of merge_cities + hfi_cities
final_df = hfi_cities.merge(merge_cities, how='left', left_on='ISO2', right_on='country code')

# fill quartile NaN with zeros, fill year NaN with 2019 to account for countries that are not in the HFI
final_df['hf_quartile'] = final_df['hf_quartile'].fillna(0)
final_df['year'] = final_df['year'].fillna(2019)

# fill missing country names with countries from geonames
final_df['countries'] = final_df['countries'].fillna(final_df['country'])

# filter by year 2019
df2019 = final_df.loc[final_df['year'] == 2019]

# print rows with NaN values
# print(df2019[df2019.isna().any(axis=1)])
#
# # count Unique values - Count Countries
# print(df2019['countries'].nunique())

df2019.to_csv('cities2019.csv', index='reset')