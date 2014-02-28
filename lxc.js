module.exports = function(config){

    var obj = {}
    var child = require('child');

    //http://stackoverflow.com/questions/10530532/
    function textToArgs(s){
        var words = [];
        s.replace(/"([^"]*)"|'([^']*)'|(\S+)/g,function(g0,g1,g2,g3){ words.push(g1 || g2 || g3 || '')});            
        return words
    }

    var sysExec = function(command, onData, onClose){

        onData = onData || function(){}
        onClose = onClose || function(){}
    
        var runCommand = textToArgs(command);

        var errors = '';

        child({
            command: runCommand.slice(0,1)[0],
            args: runCommand.slice(1),
            cbStdout: function(data){ onData(''+data) },
            cbStderr: function(data){ errors+=data; onData(''+data) },
            cbClose: function(exitCode){ onClose(exitCode == 0 ? null:exitCode,  errors) }
        }).start()
    }

    obj.list = function(cbData){

        var output = '';
        var colNames = ['name','state', 'ipv4','autostart'];
        sysExec('lxc-ls --fancy --fancy-format=name,state,ipv4,ipv6,autostart', function(data){output+=data}, function(error){

            output = output.split("\n");
            
            // skip header lines
            output.splice(0,2);
            
            var actual = false;            
            var result = {
            };

            for (i in output)
            {
                var content = output[i].trim();
                var withoutTrim = output[i].split(' ');
                var columns = [];
                for (var j in withoutTrim) {
                    if (withoutTrim[j] != '') {
                    columns.push(withoutTrim[j]);
                    }
                };
                var container = {
                 name: columns[0],
                 status: columns[1],
                 ipv4: columns[2],
                 ipv6: columns[3],
                 autostart: columns[4]
                };
                
                if (container.name) {
                    result[container.name] = container; 
                }
            }

            cbData(null, result);
        });
    }
 
    return obj;
}
