export function maxProfit(x, y) {
    const profitA = 50000; 
    const profitB = 30000;
    const timeA = 1;
    const timeB = 0.5;
    const materialA = 3;
    const materialB = 2;
    const maxTime = 12;
    const maxMaterial = 50; 

    const totalTime = x * timeA + y * timeB;
    const totalMaterial = x * materialA + y * materialB;
    const totalProfit = x * profitA + y * profitB;

    return (totalTime <= maxTime && totalMaterial <= maxMaterial) ? totalProfit : 0;
}
