clear;
ObjectiveFunction = @fitness;
lb = [0.01 0.01 0.1];   % Lower bounds
ub = [0.3 0.3 0.9];  % Upper bounds
nvars = 3;
options = optimoptions('ga','PopulationSize',50,'CrossoverFraction',0.2);
[x,fval,exitflag,output,population,scores]  = ga(ObjectiveFunction,nvars,[],[],[],[],lb,ub,[],options)