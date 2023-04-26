import pygad
from pymongo import MongoClient
client = MongoClient("mongodb://zahra.aghli:d0b34lSSHas4Yc43VS@127.0.0.1:27017/admin")
db = client.DCA
priceHistory =[]
symbolHistory = db.symbolHistory.find({"symbol":"USDTIRT","jalaaliDate":{"$gte":"1401/11/05"}}).sort('date', -1)
for item in symbolHistory:
    priceHistory.append(item["closePrice"])
takeProfit = 0
goingDown = 0
period = 0
inputs = [takeProfit, goingDown,period]

def fitness_func(classGA,solution, solution_idx):
    result =0
    tetherCount = 0
    lastTradePrice = priceHistory[0]
    for currentPrice in priceHistory:
        change = (currentPrice - lastTradePrice)/lastTradePrice
        if( change >= solution[0]):
            profit = tetherCount*(currentPrice - lastTradePrice)
            result = result + profit
            tetherCount -= (profit/currentPrice)
            lastTradePrice = currentPrice
        elif -1*change >= solution[1]:
            result = result-solution[2]
            tetherCount += (solution[2]/currentPrice)
            lastTradePrice = currentPrice
    return result + (tetherCount*priceHistory[-1])


ga_instance = pygad.GA(num_generations=100,
                       sol_per_pop=10,
                       init_range_low=2,
                       init_range_high=20,
                       num_genes=len(inputs),
                       num_parents_mating=2,
                       fitness_func=fitness_func,
                       mutation_type="random",
                       mutation_probability=0.6)

ga_instance.run()

ga_instance.plot_fitness()
solution, solution_fitness, solution_idx = ga_instance.best_solution()
print("Parameters of the best solution : {solution}".format(solution=solution))
print("Fitness value of the best solution = {solution_fitness}".format(solution_fitness=solution_fitness))