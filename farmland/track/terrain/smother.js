resources = window.resources||{};
resources["terrain"] = resources["terrain"]||{};
resources["terrain"]["smother"] = {
    "origin":[-11.2, 20.5, 0.5, 0, 0],      //x方向起点,z方向起点,x方向车间距,z方向车间距,车朝向
    "terminal":{"x":[18.5, 21.5], "z":[15, 17]},
    "ambient": [0.15, 0.15, 0.15],
    "blocks": [{
            "mod": "sky",
            "tex": "sky1",
            "pos":[{"x":0, "y": -0.01,"z":0}]
        },{
            "mod": "ground",
            "tex": "dirt1",
            "ambient": [0.1, 0.1, 0.1],
            "pos":[{"x":0, "y": -0.01,"z":0}]
        },{
            "mod": "rail_08_50",
            "tex": "brick4",
            "pos":[{"x":0, "y": -0.01,"z":0}]
        },{
            "mod": "checker_x_3",
            "tex": "checker",
            "pos":[{"x":-10.0,"z":20.0}]
        },{
            "mod": "checker_x_3",
            "tex": "checker",
            "pos":[{"x":20,"z":15}]
        },{
            "mod": "curbkerb_x_3_z_002",
            "tex": "checker",
            "pos":[{"x":-10.0,"y":-0.023, "z":24.0}]
        },{
            
            "mod": "curbkerb_x_002_z_10",
            "tex": "brick1",
            "pos":[{"x":-11.5,"z":20.0},{"x":-8.5,"z":20.0},{"x":-21.5,"z":10.0},{"x":-11.5, "z":0.0},{"x":-8.5, "z":2.0},{"x":-11.5, "z":-10.0},{"x":-8.5, "z":-8.0},{"x":4.5,"z": -10},{"x":1.5,"z": -8},{"x":14.5,"z": 0},{"x":11.5,"z": 2},{"x":21.5,"z": 12},{"x":18.5,"z": 12}]
        },{
            "mod": "curbkerb_x_10_z_002",
            "tex": "brick1",
            "pos":[{"x":-13.5,"z":13.0},{"x":-16.5,"z":15.0},{"x":-13.5, "z":7.0},{"x":-16.5, "z":5.0},{"x":-3.5,"z": -13},{"x":-6.5,"z": -15},{"x":6.5,"z": -3},{"x":9.5,"z": -5}]
        },{
            "mod": "curbkerb_x_002_z_2",
            "tex": "brick1",
            "pos":[{"x":-8.5,"z":14.0},{"x":-18.5,"z":12.0},{"x":-18.5,"z":10.0},{"x":-18.5,"z":8.0},{"x":21.5,"z": 6}]
        },{
            "mod": "curbkerb_x_3_z_002",
            "tex": "brick1",
            "pos":[{"x":0,"z": -15},{"x":3,"z": -15},{"x":13.0,"z": 7},{"x":16.0,"z": 7},{"x":17.0,"z": 7},{"x":16.0,"z": 5},{"x":19.0,"z": 5},{"x":20.0,"z": 5},{"x":20,"z": 17}]
        },{
            
            "mod": "road_x_3_z_10",
            "tex": "brick6",
            "pos":[{"x":-10.0, "z":20.0},{"x":-20.0, "z":10.0},{"x":-10.0, "z":0.0},{"x":-10.0, "z":-10.0},{"x":3,"z": -10},{"x":13,"z": 0},{"x":20,"z": 12}]
        },{
            "mod": "road_x_10_z_2",
            "tex": "brick6",
            "pos":[{"x":-13.5, "z":14.0},{"x":-13.5, "z":6.0},{"x":-3.5,"z": -14},{"x":6.5,"z": -4},{"x":16.5,"z": 6}]
        },{
            
            "mod": "tree_1",
            "tex": "tree1",
            "pos":[
                {"x":24.0,"z":8},{"x":17,"z": 12},{"x":13.5,"z": 9},
                {"x":-14.0,"z":20},{"x":-16.0,"z":12},{"x":-13.5,"z":4},{"x":-13.5,"z":-13},{"x":-6.5,"z":-12},{"x":-5.5,"z":-6},{"x":-4.5,"z": -17},{"x":-1.5,"z": -10},{"x":-24.5,"z":-20}
            ]
        },{
            
            "mod": "tree_1",
            "tex": "tree4",
            "ambient": [0.15, 0.15, 1.0],
            "pos":[
                {"x":24.5,"z":-20},
            ]
        },{
            
            "mod": "hourse_1",
            "tex": "hourse1",
            "ambient": [0.1, 0.1,0.1],
            "pos":[
                {"x":-13.5,"z":18},{"x":-17.0,"z":10},{"x":-13.5,"z":-10},{"x":-23.5,"z":-22},{"x":24.0,"z":0}
            ]
        },{
            
            "mod": "hourse_1",
            "tex": "hourse1",
            "ambient": [0.15, 0.15,1.0],
            "pos":[
                {"x":23.5, "z":-18}
            ]
            
        },{
            
            "mod": "billboard_z_10",
            "tex": "billboard-html5-1",
            "ambient": [0.15, 0.15,1.0],
            "pos":[{"x":-21.8,"z":10.0}]
        }
    ]
};
