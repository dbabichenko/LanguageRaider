<?php
header('Content-Type: application/json');
require("dbutils.php");

# https://www.w3schools.com/php/php_mysql_prepared_statements.asp
# https://www.w3schools.com/php/php_mysql_insert.asp

$scenarioID = "1";
$parentID = $_GET["parentID"];






    
    $conn = new mysqli($hostName, $dbUserName, $dbPassword, $dbName);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }


    $sql = "SELECT uuid() AS nodeID, statementID AS `name`, parentID AS parent, statementText, isCorrect, agentName, agentType, fillColor, agentLanguage, agentVoice ";
    $sql .= "FROM statements JOIN agents ON fk_agentID = agentID JOIN tree ON statementID = childID ";
    $sql = $sql . "WHERE parentID = ?;";
    
    // echo($sql);
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $parentID);
    $stmt->execute();
    echo($stmt->error);
    $result = $stmt->get_result();
    // $result = $conn->query($sql);
    $dataArray = array();
    // echo($result->num_rows);
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            // echo "parentID: " . $row["parent"]. "  " . $row["statementText"]. "<br>";
            array_push($dataArray, $row);
        }
    } 
    
    echo(json_encode(array('statements'=>$dataArray)));
    $conn->close();
    $stmt->close();

?>