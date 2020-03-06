Database access


====== Email 

Hi everyone, 

The dw level table also done. It’s time to move up. 

I suggest we may use a division: 
1. Q1 Where do most researchers move to? - Yannan
2. Q2 What countries/states are experiencing the ‘brain drain’? - Yonghao
3. Q3 For the same person who has at least two consecutive employments, how long do they stay in each, do they change cities, and do role-title get changed? -Shaoli 
4. New Q1 Find one or two discipline/subjects profiles, by searching the attribute of ’dep’ and ’title’ for key word and answer the Q1-3 again to find any pattern in the certain field. 
5. New Q2 Try gravity mode, find the pattern we may missed in orcid's unrepresentative data.
Also, if we find any pattern interesting, try to link it with the real-world policy.


I put some usage memo here, please have a look before you start: https://docs.google.com/document/d/1c3J2RNhPjTLaz--KWXgUk_EbpkQmzmG5B_l_2KGI0Dc
And below is all you need to connect the database.

	MariaDB(mysql) 
	Host: db.frsvp.com
	Port: 3306
	DB: orcid2019
	Username: mahjong
	Pwd: ToHx9tx7q,SNTtxZ0 



Total: 2.25 million profiles and 6.22 million rows, both up 40% in 2019.
Employment aff: 1.77m profiles , 3.2m rows.
Education aff: 1.73m profiles , 2.88m rows..
Member aff: 0.07m profiles, 0.14m rows.



For Xin's own workflow

Connecting from MySQL to pandas dataframe 
https://pythontic.com/pandas/serialization/mysql


Google drive https://drive.google.com/drive/u/0/folders/1WpzKfE45hS_igmCmsimV8Y2mIQps2SX3





	
Best,
Shaoli


