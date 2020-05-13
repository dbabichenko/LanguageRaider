<?php
header('Content-Type: application/json');
require("dbutils.php");

# https://www.w3schools.com/php/php_mysql_prepared_statements.asp
# https://www.w3schools.com/php/php_mysql_insert.asp

$scenarioID = "1";
$parentID = $_GET["parentID"];



/*
SELECT parentID, b.turnID, c.statementID, statementText, isCorrect, agent 
FROM turn_sequence a JOIN turns b ON a.childID = b.turnID
JOIN turn_statements c ON b.turnID = c.turnID 
JOIN statements d ON c.statementID = d.statementID 
WHERE scenarioID = 1 AND parentID = 2
*/

if($scenarioID != "" && $parentID != ""){
    
    $conn = new mysqli($hostName, $dbUserName, $dbPassword, $dbName);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }


    $sql = "SELECT parentID, b.turnID, c.statementID, statementText, isCorrect, agent, agentType, audioFile, agentLanguage, agentVoice ";
    $sql = $sql . "FROM turn_sequence a JOIN turns b ON a.childID = b.turnID ";
    $sql = $sql . "JOIN turn_statements c ON b.turnID = c.turnID ";
    $sql = $sql . "JOIN statements d ON c.statementID = d.statementID ";
    $sql = $sql . "WHERE scenarioID = ? AND parentID = ?;";
    
    // echo($sql);
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $scenarioID, $parentID);
    $stmt->execute();
    echo($stmt->error);
    $result = $stmt->get_result();
    // $result = $conn->query($sql);
    $dataArray = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            // echo "parentID: " . $row["parentID"]. " - turnID: " . $row["turnID"]. " " . $row["statementText"]. "<br>";
            array_push($dataArray, $row);
        }
    } 
    
    echo(json_encode(array('statements'=>$dataArray)));
    $conn->close();
    $stmt->close();
}
?>