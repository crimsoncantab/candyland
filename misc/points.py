#!/usr/bin/python3

height = 15
width = 20

print(*[i for i in range(width)], sep = ',', end=',')
print(19, sep = ',', end=',')
print(*[i for i in range(19,10,-1)], sep = ',', end=',')
print(11, sep = ',', end=',')
print(*[i for i in range(11,20)], sep = ',', end=',')
print(19, sep = ',', end=',')
print(*[i for i in range(19,8,-1)], sep = ',', end=',')
print(*[9 for i in range(9,12)], sep = ',', end=',')
print(*[i for i in range(8,-1,-1)], sep = ',', end=',')
print(*[0 for i in range(10,5,-1)], sep = ',', end=',')
print(*[i for i in range(1,12)], sep = ',', end=',')
print(11, sep = ',', end=',') #5
print(*[i for i in range(11,5,-1)], sep = ',', end=',')
print(6, sep = ',', end=',') #3
print(*[i for i in range(6,width)], sep = ',', end=',')
print(19, sep = ',', end=',') #1
print(*[i for i in range(19,3,-1)], sep = ',', end=',')
print(*[4 for i in range(1,5)], sep = ',', end=',')
print(*[i for i in range(3,-1,-1)], sep = ',', end=',')
print(*[0 for i in range(3,-1,-1)], sep = ',', end=',')
print(1, sep = ',', end=',') #0
print(2, sep = ',', end=',') #0
print(2, sep = ',', end=',') #1
print()


print(*[14 for i in range(width)], sep = ',', end=',')
print(13, sep = ',', end=',')
print(*[12 for i in range(19,10,-1)], sep = ',', end=',')
print(11, sep = ',', end=',')
print(*[10 for i in range(11,20)], sep = ',', end=',')
print(9, sep = ',', end=',')
print(*[8 for i in range(19,8,-1)], sep = ',', end=',')
print(*[i for i in range(9,12)], sep = ',', end=',')
print(*[11 for i in range(8,-1,-1)], sep = ',', end=',')
print(*[i for i in range(10,5,-1)], sep = ',', end=',')
print(*[6 for i in range(1,12)], sep = ',', end=',')
print(5, sep = ',', end=',') #5
print(*[4 for i in range(11,5,-1)], sep = ',', end=',')
print(3, sep = ',', end=',') #3
print(*[2 for i in range(6,width)], sep = ',', end=',')
print(1, sep = ',', end=',') #1
print(*[0 for i in range(19,3,-1)], sep = ',', end=',')
print(*[i for i in range(1,5)], sep = ',', end=',')
print(*[4 for i in range(3,-1,-1)], sep = ',', end=',')
print(*[i for i in range(3,-1,-1)], sep = ',', end=',')
print(0, sep = ',', end=',') #0
print(0, sep = ',', end=',') #0
print(1, sep = ',', end=',') #1
print()
