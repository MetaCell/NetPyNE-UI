conda deactivate
conda env remove -n netpyne
conda create -n netpyne python=3.7
conda activate netpyne
cd webapp
rm -rf node_modules
rm -rf .yalc
rm -rf build
rm -rf ~/.yalc
