import pandas as pd
import os

# get cwd
cwd = os.getcwd()
print('cwd:', cwd)

# slice df for histogram
df = pd.read_csv(cwd + '/all_countries.csv')

df_hist = df.loc[df['year'] == 2019]
columns = ['year', 'hf_score', 'pf_rol', 'pf_ss', 'pf_movement', 'pf_religion', 'pf_assembly', 'pf_expression',
           'pf_identity', 'pf_score', 'pf_womens', 'ef_size', 'ef_property', 'ef_money', 'ef_trade', 'ef_regulation',
           'ef_score']
df_hist = df_hist[columns]

# export to json
df_hist.to_json(cwd + '/histograms/mainCat.json')